// Index signature: `[prop: string]` allows any string key, as long as every
// value matches the declared type (here `number | boolean`).
type DataStore = {
    [prop: string]: number | boolean;
};

// `Record<string, number | boolean>` is the built-in utility type that
// describes the same shape as DataStore.
let someObj: Record<string, number | boolean>;

let store: DataStore = {};

// New keys can be added after creation because the index signature covers them.
store.id = 5;
store.isOpen = false;
// Error: a string value doesn't match `number | boolean`.
//store.name = 'Test';

// `as const` infers the narrowest type: a readonly tuple of literal types,
// `readonly ["admin", "guest", "editor"]`, instead of `string[]`.
let roles = ["admin", "guest", "editor"] as const;
// Error: readonly arrays have no `push` method.
// roles.push('Test');
// Type is the literal "admin", not `string`.
const firstRole = roles[0];

// `satisfies` checks the value against Record<string, number> but keeps the
// inferred type, so TypeScript still knows exactly which keys exist.
const dataEntries = {
    entry1: 0.51,
    entry2: -1.23,
} satisfies Record<string, number>;

// Error: entry3 doesn't exist. With a `: Record<string, number>` annotation
// instead of `satisfies`, this would compile and the value would be undefined.
// dataEntries.entry3

/*
 * Use cases and architectural decisions
 *
 * - Index signatures and Record fit dictionaries whose keys are only known at
 *   runtime: feature flags, counters per user ID, or parsed config. The cost
 *   is that every key is assumed to exist; enable `noUncheckedIndexedAccess`
 *   so reads are typed as `T | undefined`.
 * - Prefer Record for readability, and a named index signature type when it
 *   also needs fixed properties next to the dynamic keys.
 * - `as const` suits fixed lists such as roles, routes, or event names. A
 *   union can then be derived with `(typeof roles)[number]`, keeping one
 *   source of truth. It only freezes types; use `Object.freeze` to prevent
 *   mutation at runtime.
 * - `satisfies` is a good default for config objects: it validates the shape
 *   while preserving exact keys and literal values for autocomplete. Use an
 *   annotation instead when the variable should accept new keys later.
 */
