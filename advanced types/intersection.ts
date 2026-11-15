// Two unrelated data shapes...
type FileData = {
    path: string;
    content: string;
};

type DatabaseData = {
    connectionUrl: string;
    credentials: string;
};

// ...and a shared piece of state. `errorMessage?` is optional.
type Status = {
    isOpen: boolean;
    errorMessage?: string;
};

// Intersection (`&`): the result must have ALL properties of both types.
// Status is reused instead of copying its fields into each type.
type AccessedFileData = FileData & Status;
type AccessedDatabaseData = DatabaseData & Status;

/*
 * Use cases and architectural decisions
 *
 * - Intersections compose small, reusable pieces: timestamps
 *   (`createdAt`/`updatedAt`), a loading/error status, or an `id` added to a
 *   DTO once it is saved. Each piece is defined once and mixed in where needed.
 * - `A & B` is similar to `interface C extends A, B`. Interfaces report
 *   conflicting properties as an error at the declaration; intersections
 *   combine them silently, and incompatible types become `never`, which only
 *   shows up later when you try to create a value.
 * - Intersection (`&`) means "has everything from both"; union (`|`) means
 *   "is one of them" (see guards.ts). Mixing them up is a common mistake.
 * - Like every type, intersections disappear at runtime. Building the object
 *   still needs real code, such as a spread `{ ...fileData, ...status }`.
 */
