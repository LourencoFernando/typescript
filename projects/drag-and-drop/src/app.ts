// Drag & Drop Interfaces
// Interfaces only describe a shape; they emit no JavaScript. A class that
// `implements` one must provide every method, so the compiler catches a
// forgotten handler.
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

// Project Type
// A numeric enum: Active is 0 and Finished is 1 at runtime, but the code only
// compares named members, so the numbers never leak into the logic.
enum ProjectStatus {
    Active,
    Finished
}

// Parameter properties (`public id: string`) declare and assign each field in
// one step. A class is used instead of an interface so `new Project(...)`
// exists at runtime.
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

// Project State Management
// A generic function type: a listener receives the full list of items.
type Listener<T> = (items: T[]) => void;

// Generic base class: any state container can reuse the listener list.
// `protected` lets subclasses read `listeners` while hiding it from callers.
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

// Singleton: the private constructor blocks `new ProjectState()` outside the
// class, so every component shares the instance from `getInstance()`.
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        // In a static method, `this` is the class itself.
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );
        this.projects.push(newProject);
        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        // `find` returns `Project | undefined`, so the check narrows it.
        // Skipping an unchanged status avoids re-rendering when a project is
        // dropped back onto its own list.
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            // Pass a copy so listeners can't change the private array.
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

// Validation
// Optional properties let each input enable only the rules it needs.
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    // `!= null` excludes both undefined and null, so a limit of 0 still
    // applies. `typeof` narrows the union so `.length` or `>=` type-checks.
    if (
        validatableInput.minLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (
        validatableInput.maxLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (
        validatableInput.min != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (
        validatableInput.max != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

// autobind decorator
// Legacy method decorator (`experimentalDecorators`): it receives the
// prototype, the method name, and its descriptor. The unused first two
// parameters are named `_` and `_2` to satisfy `noUnusedParameters`.
function autobind(
    _: any,
    _2: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    // Replace the method with a getter that binds it to the instance on
    // access, so `addEventListener` keeps the correct `this`.
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}

// Component Base Class
// `abstract` prevents `new Component(...)` and forces subclasses to implement
// `configure` and `renderContent`. The constraints `T extends HTMLElement` and
// `U extends HTMLElement` let each subclass state its exact element types.
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string,
        hostElementId: string,
        insertAtStart: boolean,
        newElementId?: string
    ) {
        // `!` asserts the element exists; `as` narrows the generic
        // `HTMLElement` that `getElementById` returns.
        this.templateElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        // Deep-clone the template content so each instance gets its own nodes.
        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(
            insertAtBeginning ? "afterbegin" : "beforeend",
            this.element
        );
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

// ProjectItem Class
// Renders one project as a draggable <li> (`draggable="true"` is set in the
// `#single-project` template).
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    // A getter computes display text from state instead of storing it.
    get persons() {
        if (this.project.people === 1) {
            return "1 person";
        } else {
            return `${this.project.people} persons`;
        }
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @autobind
    dragStartHandler(event: DragEvent) {
        // `dataTransfer` is typed `DataTransfer | null`; it is always set for
        // drag events, so `!` asserts it. Only the id is transferred: the
        // drop target looks the project up in the shared state.
        event.dataTransfer!.setData("text/plain", this.project.id);
        event.dataTransfer!.effectAllowed = "move";
    }

    dragEndHandler(_: DragEvent) {
        console.log("DragEnd");
    }

    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector(
            "h3"
        )!.textContent = this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}

// ProjectList Class
// Renders the "active" or "finished" list and acts as a drop target.
class ProjectList extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[];

    // A string literal union limits `type` to the two list kinds.
    constructor(private type: "active" | "finished") {
        super("project-list", "app", false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        // Browsers reject drops by default; `preventDefault` here marks the
        // list as a valid target. Checking the data type ignores other drags,
        // such as a file or selected text.
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listEl = this.element.querySelector("ul")!;
            listEl.classList.add("droppable");
        }
    }

    @autobind
    dropHandler(event: DragEvent) {
        // The list doesn't move DOM nodes itself: it updates the state, and
        // the listeners re-render both lists.
        const prjId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(
            prjId,
            this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
        );
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.remove("droppable");
    }

    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        this.element.addEventListener("drop", this.dropHandler);

        // The arrow function keeps `this` as the list, so `this.type` works.
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === "active") {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId;
        this.element.querySelector("h2")!.textContent =
            this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
        const listEl = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement;
        // Clear and rebuild the list so it always matches the state.
        listEl.innerHTML = "";
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
        }
    }
}

// ProjectInput Class
// Renders the form at the start of #app and adds a project on valid submit.
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", true, "user-input");

        this.titleInputElement = this.element.querySelector(
            "#title"
        ) as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
            "#description"
        ) as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector(
            "#people"
        ) as HTMLInputElement;

        this.configure();
    }

    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    // Required by the abstract base class; the form has no dynamic content.
    renderContent() {}

    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    // The tuple return type fixes the order and type of each value. `void`
    // covers the invalid case, where the method returns nothing.
    private getUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        // Unary `+` converts the input's string value to a number.
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert("Invalid input, please try again");
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.getUserInput();
        // `Array.isArray` narrows `[string, string, number] | void` to the tuple.
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}

// The constructors render and wire up everything; the variables are only
// kept as handles to the instances.
const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");

/*
 * Use cases and architectural decisions
 *
 * - Central state with listeners: the lists never move DOM nodes on a drop.
 *   They call `projectState.moveProject`, and every list re-renders from the
 *   new state. This one-way flow (event -> state -> render) is the core idea
 *   behind Redux, Vuex, and similar stores. The tradeoff is that this version
 *   clears and rebuilds each list on every change, which is fine for a few
 *   items but loses focus and scroll position. Frameworks diff the DOM instead.
 *
 * - Singleton state: `getInstance()` gives every component the same store
 *   without passing it around. It also makes the store a hidden global that is
 *   hard to reset in tests. Passing the store into constructors (dependency
 *   injection) is the usual alternative once an app grows.
 *
 * - Generic `State<T>` and `Component<T, U>`: the generics let another feature
 *   (for example a `State<User>` or a `Component<HTMLDivElement, HTMLLIElement>`)
 *   reuse the listener and template logic with exact types. `abstract` methods
 *   enforce the `configure`/`renderContent` lifecycle at compile time only.
 *
 * - `Draggable` and `DragTarget` interfaces: they make the drag contract
 *   explicit, so any future element (a trash bin, a third column) that
 *   `implements DragTarget` must handle all three events. The interfaces
 *   disappear at runtime; the browser only sees the event listeners.
 *
 * - Native HTML drag and drop: `dataTransfer` carries only strings, so the item
 *   sends its id and the target looks the project up in state. This avoids a
 *   library, but the API has no touch support on most mobile browsers and is
 *   awkward to style. Libraries built on pointer events are the common choice
 *   when mobile support or sortable lists are needed.
 *
 * - `@autobind` with `experimentalDecorators`: it fixes `this` for event
 *   handlers in one place. Arrow-function class fields (`handler = () => {}`)
 *   achieve the same without decorators, and standard ECMAScript decorators
 *   use a different signature, so this decorator would need rewriting if the
 *   option were turned off.
 *
 * - `Math.random().toString()` ids can collide and aren't stable across
 *   reloads; `crypto.randomUUID()` or server-generated ids are safer in a real
 *   app. State also lives only in memory, so a reload clears every project.
 */
