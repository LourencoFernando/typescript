// Component Base Class
// `export default`: the module has one main export, and importers choose its
// local name with `import Component from "./base-component.js"` (no braces).
// `abstract` prevents `new Component(...)` and forces subclasses to implement
// `configure` and `renderContent`. The constraints `T extends HTMLElement` and
// `U extends HTMLElement` let each subclass state its exact element types.
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

/*
 * Use cases and architectural decisions
 *
 * - A default export fits a file built around one thing, like a component or
 *   a class per file. The tradeoff is that each importer can pick any name, so
 *   the same class may appear under different names, and editors rename or
 *   auto-import named exports more reliably. Many style guides prefer named
 *   exports for that reason.
 *
 * - `class ... extends Component` runs when a component module is evaluated,
 *   so this module must be evaluated first. ES modules guarantee that by
 *   evaluating imports before the importing file, which replaces the
 *   hand-ordered `<script>` tags of the namespace version.
 *
 * - The constructor reads the DOM, so the modules can be imported without a
 *   document (in Node or tests), but creating a component needs one. Keeping
 *   side effects out of module top level is what makes that split possible.
 */
