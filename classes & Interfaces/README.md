# Classes & Interfaces

Standalone examples about classes and interfaces. There is no tsconfig here;
type-check one file at a time:

```sh
tsc --noEmit --strict "classes & Interfaces/basics.ts"
```

## Reading order

1. `basics.ts`: explicit fields, parameter properties, `private`, and `readonly`.
2. `advanced.ts`: getters, setters, `protected`, `static`, inheritance, and
   abstract classes.
3. `interfaces.ts`: declaring an object contract with an interface.

## Study questions

- When are parameter properties clearer than explicit fields, and when do they
  hide too much?
- Why does `readonly hobbies: string[]` still allow `push`?
- What do `private` and `readonly` protect at compile time but not at runtime?
- Why does reading a property that has only a setter return `undefined`?
- When should a base class be abstract instead of an interface?
