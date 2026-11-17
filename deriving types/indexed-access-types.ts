type AppUser = {
    name: string;
    age: number;
    permissions: {
        id: string;
        title: string;
        description: string;
    }[];
};

// Indexed access type: `Type["key"]` reads the type of one property, here
// the array type `{ id: string; title: string; description: string }[]`.
type Perms = AppUser["permissions"];

// `[number]` reads the element type of an array type, so Perm is the type of
// a single permission object. This names a type that was declared inline.
type Perm = Perms[number];

/*
 * Use cases and architectural decisions
 *
 * - Indexed access types extract nested types from a large type you don't
 *   want to split, such as a generated API response or a library's options
 *   object, e.g. a component prop typed as `AppUser["permissions"][number]`.
 * - The derived type stays in sync with the parent: adding a field to the
 *   inline permission shape updates Perm everywhere.
 * - If the nested type is reused across the codebase, extracting it as a
 *   named type (`type Permission = {...}`) is usually clearer than deriving
 *   it each time. Deriving fits best when you don't own the parent type.
 * - Unlike `obj["key"]` at runtime, `Type["key"]` only works with keys that
 *   exist on the type; a wrong key is a compile error.
 */
