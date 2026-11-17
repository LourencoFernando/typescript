type ReadPermissions = "no-read" | "read";
type WritePermissions = "no-write" | "write";

// Template literal type: the same syntax as a JavaScript template string, but
// for types. Unions are expanded into every combination:
// "no-read-no-write" | "no-read-write" | "read-no-write" | "read-write".
type FilePermissions = `${ReadPermissions}-${WritePermissions}`;

type DataFile = {
    data: string;
    permissions: FilePermissions;
};

// Combined with `keyof`: one event name per property,
// "dataChanged" | "permissionsChanged".
type DataFileEventNames = `${keyof DataFile}Changed`;

// Combined with a mapped type: an object with one handler per event name.
type DataFileEvents = {
    [Key in DataFileEventNames]: () => void;
};

/*
 * Use cases and architectural decisions
 *
 * - Template literal types model string formats with a fixed structure:
 *   permission strings, CSS units (`${number}px`), route paths, or event
 *   names such as `on${Capitalize<EventName>}` in component props.
 * - Deriving event names from `keyof DataFile` keeps an event API in sync
 *   with the data model: adding a property adds its "...Changed" event.
 * - Unions multiply: two unions of 10 members produce 100 combinations, and
 *   large expansions slow the compiler or hit its limits. Keep the inputs
 *   small.
 * - The check is compile-time only. Strings from users or files must be
 *   validated at runtime (e.g. with a regex) before being treated as a
 *   FilePermissions value.
 */
