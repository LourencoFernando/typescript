// This file practices three import styles:
// - default import: `Component` has no braces because it is the module's
//   `export default`, and the local name is chosen here.
// - renamed import: `autobind as Autobind` binds the export `autobind` to the
//   local name `Autobind`.
// - namespace import: `* as Validation` collects every export of the module in
//   one object, used as `Validation.validate` and `Validation.Validatable`.
import Component from "./base-component.js";
import { autobind as Autobind } from "../decorators/autobind.js";
import * as Validation from "../utils/validation.js";
import { projectState } from "../state/project-state.js";

// ProjectInput Class
// Renders the form at the start of #app and adds a project on valid submit.
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    // The tuple return type fixes the order and type of each value. `void`
    // covers the invalid case, where the method returns nothing.
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        // A namespace import also exposes the module's types, so
        // `Validation.Validatable` works as a type annotation.
        const titleValidatable: Validation.Validatable = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable: Validation.Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        // Unary `+` converts the input's string value to a number.
        const peopleValidatable: Validation.Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (
            !Validation.validate(titleValidatable) ||
            !Validation.validate(descriptionValidatable) ||
            !Validation.validate(peopleValidatable)
        ) {
            alert("Invalid input, please try again!");
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    // The decorator is used under its local, renamed name.
    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        // `Array.isArray` narrows `[string, string, number] | void` to the tuple.
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}

/*
 * Use cases and architectural decisions
 *
 * - Named imports (`{ projectState }`) are the default choice: they show
 *   exactly what a file depends on, and editors and bundlers track them
 *   reliably. The other two styles here solve specific problems.
 *
 * - A renamed import resolves a clash, for example two libraries that both
 *   export `Component`, or aligns a name with local conventions. It makes the
 *   code harder to search, because the same function has two names.
 *
 * - A namespace import groups a module's API under one prefix, which helps
 *   when its exports have generic names (`validate`, `parse`) or come from a
 *   large utility module. It is also the usual way to import a CommonJS
 *   package that has no default export.
 *
 * - A default import is decided by the exporting module, not by this file.
 *   Changing `base-component.ts` between `export default` and a named export
 *   breaks every importer, which is why that choice is part of a module's API.
 *
 * - Every import path ends in `.js`, even though the source is `.ts`, because
 *   TypeScript doesn't rewrite paths: the browser requests exactly the path in
 *   the compiled file.
 */
