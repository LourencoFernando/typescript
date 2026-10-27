# TypeScript Foundations

Small examples for understanding how TypeScript describes values and checks their use. Read the files in this order:

| File | Concepts | Try to explain |
| --- | --- | --- |
| [basics.ts](basics.ts) | Explicit annotations, inference, default parameters, inferred return types | Why is `userAge` a number even without an annotation? |
| [flexible-types.ts](flexible-types.ts) | `any` and union types | What checks do you lose with `any`, and what does a union preserve? |
| [arrays-objects.ts](arrays-objects.ts) | Array inference, union elements, `Array<T>` notation | Why can `users` contain strings and numbers together? |

The arrays file currently contains array examples only; object examples can be added as you study them.

## How to study an example

1. Predict the inferred types and which assignments TypeScript accepts.
2. Read the code and comments, then check your reasoning with your editor's type hints.
3. Experiment with one change at a time and explain any compiler error in your own words.
4. If you use AI, ask it to challenge your explanation and compare alternatives.

## Design notes

- Inference can keep code concise while preserving type checking.
- A union describes a deliberate set of possibilities. Before performing an operation specific to one member, narrow the value to that type.
- `any` removes useful checks and can hide mistakes from the compiler.
- TypeScript's types do not validate external data at runtime. Runtime validation is a separate concern when designing system boundaries.
