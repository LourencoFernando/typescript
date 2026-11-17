type User = { name: string; age: number };

// `keyof` produces a union of an object type's property names: "name" | "age".
type UserKeys = keyof User;

let validKey: UserKeys;

validKey = "name";
validKey = "age";
// validKey = "email" would be an error: "email" is not a key of User.

// `U extends keyof T` limits `key` to the property names of the object that
// was actually passed. `obj[key]` then has the type `T[U]`, so the return type
// follows the chosen key.
function getProp<T extends object, U extends keyof T>(obj: T, key: U) {
    const val = obj[key];

    // Runtime check: types can't guarantee a value is present at runtime.
    if (val === undefined || val === null) {
        throw new Error("Accessing undefined or null value.");
    }

    return val;
}

const data = { id: 1, isStored: false, values: [1, -5, 10] };
// Typed as `boolean`, because data["isStored"] is a boolean.
const isStored = getProp(data, "isStored");

const user = { name: "Max", age: 35 };

// Typed as `number`. getProp(user, "email") would be a compile-time error.
const val = getProp(user, "age");

/*
 * Use cases and architectural decisions
 *
 * - `keyof` with a constrained type parameter is the pattern behind typed
 *   helpers such as `pick(obj, key)`, sort-by-column functions in a table
 *   component, or form libraries that accept only real field names.
 * - It replaces stringly-typed APIs: a typo in a key becomes a compile error,
 *   and renaming a property updates every valid key automatically.
 * - `keyof` only covers keys known at compile time. For objects with an index
 *   signature it becomes `string` (or `string | number`), so the check is
 *   much weaker.
 * - Keys from user input (URL params, JSON) are plain strings at runtime;
 *   validate them before passing them where `keyof T` is expected.
 */
