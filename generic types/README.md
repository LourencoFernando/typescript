# Generic Types

Standalone examples about generics. There is no tsconfig here; type-check one
file at a time:

```sh
tsc --noEmit --strict "generic types/generics.ts"
```

## Reading order

1. `generics.ts`: built-in generic types, generic type aliases, generic
   functions with one or more type parameters, constraints with `extends`, and
   generic classes.

## Study questions

- How is `Array<string>` related to `string[]`?
- When does `merge<number>(1, 2)` need its explicit type argument, and when is
  inference enough?
- Why does `mergeObj` need `T extends object` before spreading `a` and `b`?
- Why does `mergeMultiple` return `(T | U)[]` instead of a tuple `[T, U]`?
- What does a type parameter like `T` look like at runtime?
