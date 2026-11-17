# Deriving Types from Types

Standalone examples about building new types from existing ones. There is no
tsconfig here; type-check one file at a time:

```sh
tsc --noEmit --strict "deriving types/typeof.ts"
```

`conditional.ts` calls `getFullname({})`, which throws on purpose if you run it.

## Reading order

Type operators that read from existing types and values:

1. `typeof.ts`: the type of a value, and how it differs from runtime `typeof`.
2. `keyof.ts`: a union of property names, and a `getProp` helper constrained
   with `U extends keyof T`.
3. `indexed-access-types.ts`: reading a property type with `Type["key"]` and
   an array element type with `[number]`.

Building new types from existing ones:

4. `mapped-types.ts`: looping over keys with `[key in keyof T]`, and how
   `readonly` is preserved.
5. `template-literal-types.ts`: string patterns, union combinations, and event
   names derived with `keyof`.

Conditional types:

6. `conditional.ts`: `T extends X ? A : B`, and a function with a conditional
   return type.
7. `infer.ts`: capturing part of a type with `infer`, as the built-in
   `ReturnType` does.

## Study questions

- Why is `typeof userName` the literal type "Test2" while
  `console.log(typeof userName)` prints "string"?
- How does `getProp` know that `getProp(user, "age")` returns a `number`?
- When should a nested type be derived with `AppUser["permissions"][number]`
  instead of declared as its own named type?
- Why is `mathResults.add = 10` an error even though Results never writes
  `readonly`?
- How many members does `FilePermissions` have, and what happens as the input
  unions grow?
- Why does `getFullname` need an `as` assertion in its body?
- What does `GetElementType<string[] | number>` return, and why?
- Which built-in utility type does `ReturnValueType` reimplement?
