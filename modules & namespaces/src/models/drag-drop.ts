// Drag & Drop Interfaces
// A file with `export` is an ES module: its names stay local unless another
// file imports them. Interfaces exist only at compile time, so this file
// compiles to an empty module (`export {};`), and TypeScript removes the
// imports of these names from the files that use them.
export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

/*
 * Use cases and architectural decisions
 *
 * - Contracts in their own module: `ProjectItem` and `ProjectList` import these
 *   interfaces without importing each other, so a new draggable or drop target
 *   depends only on this file. Shared types often live in a `models/` or
 *   `types/` folder for that reason.
 *
 * - Type-only modules cost nothing at runtime, but the browser still requests
 *   `dist/models/drag-drop.js` if any compiled file kept the import. TypeScript
 *   drops imports that are only used as types; `import type { Draggable }`
 *   makes that explicit and is required under `verbatimModuleSyntax`.
 */
