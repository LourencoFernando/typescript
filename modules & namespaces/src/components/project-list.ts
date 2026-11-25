import Component from "./base-component.js";
import { autobind } from "../decorators/autobind.js";
// Type-only imports (`DragTarget`, `Project`) are removed from the compiled
// file; `ProjectStatus` stays because the enum is used as a value.
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

// ProjectList Class
// Renders the "active" or "finished" list and acts as a drop target.
export class ProjectList extends Component<HTMLDivElement, HTMLElement>
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

/*
 * Use cases and architectural decisions
 *
 * - This file has the most imports because it connects the layers: models,
 *   state, the decorator, and the item component. The import list doubles as
 *   documentation of a module's dependencies, which the namespace version only
 *   showed through `/// <reference>` comments that the browser ignored.
 *
 * - Importing the shared `projectState` instance couples the list to one
 *   global store. Passing the store in through the constructor would let the
 *   same list work with a test store or a second board.
 *
 * - Each import is a separate browser request in this setup, and the browser
 *   discovers them one level at a time (app -> list -> item -> base). That is
 *   fine locally; production builds bundle modules (Vite, esbuild, webpack) to
 *   cut requests, and HTTP/2 or `<link rel="modulepreload">` reduce the cost of
 *   unbundled modules.
 *
 * - The list clears and rebuilds its items on every state change, which is
 *   fine for a few items but loses focus and scroll position. Frameworks diff
 *   the DOM instead.
 */
