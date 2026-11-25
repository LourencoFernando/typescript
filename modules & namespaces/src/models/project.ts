// Project Type
// An enum is both a type and a runtime object, so importing `ProjectStatus`
// keeps a real import in the compiled JavaScript (unlike the interfaces in
// `drag-drop.ts`).
export enum ProjectStatus {
    Active,
    Finished
}

// Parameter properties declare and assign each field in one step. A class is
// used instead of an interface so `new Project(...)` exists at runtime.
export class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {}
}

/*
 * Use cases and architectural decisions
 *
 * - A models module has no imports, so every other layer (state, components)
 *   can depend on it without creating an import cycle. Keeping the domain types
 *   at the bottom of the dependency graph is the usual way to keep modules
 *   loosely coupled.
 *
 * - Exporting several related names from one module (`Project` and
 *   `ProjectStatus`) keeps imports short. Split them only when another feature
 *   needs one without the other.
 *
 * - Enums and parameter properties generate JavaScript, so Node's type
 *   stripping (`node file.ts`) rejects them. A union type such as
 *   `"active" | "finished"` and explicit fields avoid that if the code ever
 *   needs to run without a build step.
 */
