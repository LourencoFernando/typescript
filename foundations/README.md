# TypeScript Foundations

Small examples for understanding how TypeScript describes values and checks their use. Read the files in this order:

| File | Concepts | Try to explain |
| --- | --- | --- |
| [basics.ts](basics.ts) | Explicit annotations, inference, default parameters, inferred return types | Why is `userAge` a number even without an annotation? |
| [flexible-types.ts](flexible-types.ts) | `any` and union types | What checks do you lose with `any`, and what does a union preserve? |
| [arrays-objects.ts](arrays-objects.ts) | Arrays, tuples, nested objects, `{}`, and `Record` | Why can `users` contain strings and numbers together? |
| [choices.ts](choices.ts) | Enums, literal unions, and type aliases | How does an enum differ from a union of string literals? |
| [special-types.ts](special-types.ts) | Nullable values | Why does `a` accept both a string and `null`? |
| [functions.ts](functions.ts) | Return types, `void`, `never`, callbacks, and methods | How does `never` differ from `void`? |
| [forms.ts](forms.ts) | DOM type assertions and null checks | What does the assertion guarantee, and what must you check at runtime? |

These files are standalone examples. Check them individually: some reuse names such as `User`, `user`, and `add`. The forms example requires a browser DOM.

## How to study an example

1. Predict the inferred types and which assignments TypeScript accepts.
2. Read the code and comments, then check your reasoning with your editor's type hints.
3. Uncomment examples one at a time to explore alternatives or expected type errors, then comment them out again.
4. Experiment with one change at a time and explain any compiler error in your own words.
5. If you use AI, ask it to challenge your explanation and compare alternatives.

## Design notes

- Inference can keep code concise while preserving type checking.
- A union describes a deliberate set of possibilities. Before performing an operation specific to one member, narrow the value to that type.
- `any` removes useful checks and can hide mistakes from the compiler.
- TypeScript's types do not validate external data at runtime. Runtime validation is a separate concern when designing system boundaries.
