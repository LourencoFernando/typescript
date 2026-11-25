import { Project, ProjectStatus } from "../models/project.js";

// Project State Management
// A generic function type: a listener receives the full list of items.
type Listener<T> = (items: T[]) => void;

// Not exported: `State` is an implementation detail of this module. Only
// `ProjectState` and the `projectState` instance are part of its public API.
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

// Singleton: the private constructor blocks `new ProjectState()` outside the
// class, so every component shares the instance from `getInstance()`.
export class ProjectState extends State<Project> {
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

// A module runs once per page, no matter how many files import it, so every
// importer receives this same instance.
export const projectState = ProjectState.getInstance();

/*
 * Use cases and architectural decisions
 *
 * - Exporting an instance (`projectState`) makes the module itself the
 *   singleton: ES modules are evaluated once and cached, so `getInstance()` is
 *   no longer what guarantees a single store. It is kept here as the course's
 *   pattern; in module-based code, exporting the instance alone is common.
 *
 * - Not exporting `State` and `Listener` hides them from other modules, which
 *   namespaces could only do by leaving off `export` inside the namespace
 *   block. A module boundary is the main tool for keeping internals private.
 *
 * - A module-level instance is shared by every importer, including tests, and
 *   can't be reset between them. Passing the store into components
 *   (dependency injection) is the usual alternative once an app grows.
 *
 * - `Math.random().toString()` ids can collide; `crypto.randomUUID()` or
 *   server-generated ids are safer. The state also lives only in memory, so a
 *   reload clears every project.
 */
