import Component from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
// `Draggable` and `Project` are only used as types here, so TypeScript removes
// these two imports from the compiled JavaScript.
import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";

// ProjectItem Class
// Renders one project as a draggable <li> (`draggable="true"` is set in the
// `#single-project` template).
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
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
        // drag events, so `!` asserts it. Only the id is transferred: the drop
        // target looks the project up in the shared state.
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
        this.element.querySelector("h3")!.textContent = this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}

/*
 * Use cases and architectural decisions
 *
 * - Import elision: the compiled file only imports `Component` and `autobind`,
 *   the two names used as values. This keeps type-only modules such as
 *   `drag-drop.ts` from adding browser requests. Writing
 *   `import type { Draggable }` states the intent and still works if
 *   `verbatimModuleSyntax` is enabled, which keeps every plain import as
 *   written.
 *
 * - The item imports neither the list nor the state. It only renders a
 *   project and starts a drag, so it can be reused in any container, and the
 *   dependency runs in one direction: `project-list` imports `project-item`.
 *   Two components that import each other create a cycle, which ES modules
 *   allow but which can leave one side undefined while the other evaluates.
 *
 * - Native drag and drop has no touch support on most mobile browsers.
 *   Libraries built on pointer events are the common choice when mobile
 *   support matters.
 */
