// Discriminated union: each member has a `type` property with a unique
// literal value, which TypeScript can use to tell the members apart.
type FileSource = { type: "file"; path: string };
const fileSource: FileSource = {
    type: "file",
    path: "some/path/to/file.csv",
};

type DBSource = { type: "db"; connectionUrl: string };
const dbSource: DBSource = {
    type: "db",
    connectionUrl: "some-connection-url",
};

type Source = FileSource | DBSource;

// Type guard helper. Since TypeScript 5.5 the return type is inferred as the
// type predicate `source is FileSource` (not plain `boolean`), so calling it
// narrows `source` at the call site. Older versions needed that annotation
// written explicitly.
function isFile(source: Source) {
    return source.type === "file";
}

function loadData(source: Source) {
    // Alternative: the `in` operator narrows to the member that has `path`.
    // if ('path' in source) {
    if (isFile(source)) {
        // Narrowed to FileSource here.
        // source.path; => use that to open the file
        return;
    }
    // Narrowed to DBSource after the early return.
    // source.connectionUrl; => to reach out to database
}

/*
 * Use cases and architectural decisions
 *
 * - Discriminated unions model data that can take several forms, such as
 *   import sources, API responses (`{ status: "ok" } | { status: "error" }`),
 *   or reducer actions. Checking the discriminant (`source.type === "file"`)
 *   inline narrows reliably and makes a `switch` exhaustive.
 * - A helper like isFile keeps the check reusable. Inference only produces a
 *   predicate for simple checks like this one; for anything more complex,
 *   write `source is FileSource` yourself. Explicit predicates are trusted,
 *   not verified: a wrong implementation still compiles, so keep them small.
 * - `'path' in source` narrows without a discriminant property, which helps
 *   with types you don't control. It breaks silently if a property is renamed
 *   or another member gains the same key, so prefer a discriminant when you
 *   own the types.
 * - All of these checks run at runtime on real values, unlike the types
 *   themselves, so they are also the right tool for validating parsed input.
 */
