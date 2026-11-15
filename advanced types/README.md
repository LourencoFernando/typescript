# Advanced Types

Standalone examples about advanced type features. There is no tsconfig here;
type-check one file at a time:

```sh
tsc --noEmit --strict "advanced types/intersection.ts"
```

## Reading order

1. `intersection.ts`: combining object types with `&`.
2. `guards.ts`: discriminated unions, narrowing with a discriminant or `in`,
   and a type guard helper with an inferred type predicate.
3. `functions.ts`: function overloads that map input types to return types.
4. `advanced.ts`: index signatures, `Record`, `as const`, and `satisfies`.

## Study questions

- How does `A & B` differ from `interface C extends A, B` when both declare the
  same property with different types?
- What return type does TypeScript infer for `isFile`, and when would you need
  to write `source is FileSource` yourself?
- When is `'path' in source` a better check than a discriminant property?
- Why can't the implementation signature of an overloaded function be called
  directly?
- What does `satisfies` preserve that a type annotation loses?
- What does `as const` change about the type of `roles[0]`?
