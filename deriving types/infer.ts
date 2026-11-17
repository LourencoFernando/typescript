function add(a: number, b: number) {
    return a + b;
}

// `typeof` turns the function value into its type:
// (a: number, b: number) => number. Type names are usually PascalCase
// (`AddFn`); the lowercase name is kept from the course code.
type addFn = typeof add;

// `infer RV` declares a type variable inside a conditional type. If T is a
// function, TypeScript captures its return type as RV and returns it.
type ReturnValueType<T> = T extends (...args: any[]) => infer RV ? RV : never;

// number
type AddFnReturnValueType = ReturnValueType<addFn>;

/*
 * Use cases and architectural decisions
 *
 * - `infer` extracts a part of another type: a function's return or
 *   parameter types, a promise's resolved value, or an array's element type.
 *   ReturnValueType is a hand-written version of the built-in `ReturnType<T>`.
 * - A common use is deriving types from functions you don't control, e.g.
 *   `Awaited<ReturnType<typeof fetchUser>>` to type the user returned by an
 *   API helper without declaring it twice.
 * - Prefer the built-ins (`ReturnType`, `Parameters`, `Awaited`,
 *   `InstanceType`) when they fit; write a custom `infer` only for shapes
 *   they don't cover.
 * - Deriving from implementation code ties types to it: changing what `add`
 *   returns silently changes every type built from it. For public contracts,
 *   declare the type explicitly.
 */
