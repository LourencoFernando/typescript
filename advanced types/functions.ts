// Function overloads: the signatures without a body are what callers see.
// Each one maps a specific input type to a specific return type.
function getLength(val: string): string;
function getLength(val: any[]): number;

// The implementation signature must be compatible with every overload, but
// it isn't callable directly. Its body narrows with `typeof` to pick a branch.
function getLength(val: string | any[]) {
    if (typeof val === "string") {
        const numberOfWords = val.split(" ").length;
        return `${numberOfWords} words`;
    }
    return val.length;
}

// The string overload applies, so the result is typed `string` and `.length`
// is allowed. Without overloads it would be `string | number`.
const numOfWords = getLength("does this work?");
numOfWords.length;
// The array overload applies, so the result is typed `number`.
const numItems = getLength(["Sports", "Cookies"]);

/*
 * Use cases and architectural decisions
 *
 * - Overloads fit APIs whose return type depends on the argument type, such
 *   as a `parse(input: string)` vs. `parse(input: Buffer)` helper or a DOM
 *   query function that returns a specific element type per tag name.
 * - They exist only at compile time: one JavaScript function runs, so the
 *   implementation must still check types itself, and TypeScript doesn't
 *   verify that each branch matches the overload that promised it.
 * - When the return type doesn't depend on the input, a single union
 *   signature is simpler. A generic (`<T>(val: T) => ...`) is often clearer
 *   when the relationship can be expressed with type parameters.
 * - `any[]` keeps the example short; `unknown[]` or a generic is safer in
 *   real code because it doesn't disable checks on the array's elements.
 */
