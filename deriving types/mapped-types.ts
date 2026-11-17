type Operations = {
    readonly add: (a: number, b: number) => number;
    readonly subtract: (a: number, b: number) => number;
};

// Mapped type: `[key in keyof T]` loops over every key of T and gives each
// one a new type. The `?` makes every result optional, and modifiers from T
// such as `readonly` are kept. Results<Operations> is
// `{ readonly add?: number; readonly subtract?: number }`.
type Results<T> = {
    [key in keyof T]?: number;
};

let mathOperations: Operations = {
    add(a: number, b: number) {
        return a + b;
    },
    subtract(a: number, b: number) {
        return a - b;
    },
};

let mathResults: Results<Operations> = {
    add: mathOperations.add(5, 1),
    subtract: mathOperations.subtract(5, 2),
};

// Error: `add` is read-only, because the mapped type copied `readonly` from
// Operations. Writing `-readonly [key in keyof T]` would remove it.
// mathResults.add = 10

/*
 * Use cases and architectural decisions
 *
 * - Mapped types derive related shapes from one source type: form errors
 *   (`{ [K in keyof Form]?: string }`), loading flags per field, or results
 *   per operation as here. Adding an operation updates Results automatically.
 * - The built-in utility types are mapped types: `Partial<T>`, `Readonly<T>`,
 *   `Required<T>`, `Record<K, V>`, and `Pick<T, K>`. Prefer them when they
 *   express the intent; write a custom mapped type when you change the value
 *   type, as Results does.
 * - Modifiers can be added or removed with `+`/`-` (`-readonly`, `-?`). Keep
 *   that in mind when a derived type unexpectedly becomes read-only.
 * - Mapped types only describe the shape. Producing the object still needs
 *   runtime code, such as `Object.fromEntries` over the source keys.
 */
