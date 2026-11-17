const userName = "Test2";

// JavaScript `typeof` in an expression runs at runtime and returns a string
// such as "string" or "number". This logs "string".
console.log(typeof userName);

// TypeScript `typeof` in a type position reads the type of a value at compile
// time. A `const` string keeps its literal type, so UserName is "Test2".
type UserName = typeof userName;

const settings = {
    difficulty: "easy",
    minLevel: 10,
    didStart: false,
    players: ["John", "Jane"],
};

// Alternative: name the derived type once and reuse it.
// type Settings = typeof settings;

// The parameter type is derived from the object, so it stays in sync when
// `settings` gains or changes properties. Object properties are widened:
// `difficulty` is `string`, not "easy" (add `as const` to keep literals).
function loadData(s: typeof settings) {
    // ...
}

loadData(settings);

/*
 * Use cases and architectural decisions
 *
 * - `typeof` turns a value into the source of truth for its type: default
 *   config objects, fixture data in tests, or a constant list of routes.
 *   Changing the value updates every function that uses the type.
 * - The tradeoff is direction: the type follows whatever the value happens to
 *   be. For a public contract that several values must match, declare the type
 *   first and check values against it (e.g. with `satisfies`).
 * - Combine `typeof` with `as const` when exact literals matter, such as
 *   difficulty levels or event names, so the derived type isn't widened to
 *   `string`.
 * - Only the runtime `typeof` exists in the emitted JavaScript; it reports
 *   broad categories ("object", "string"), so it can't check object shapes.
 */
