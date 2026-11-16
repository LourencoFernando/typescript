# Linked List

A practice project for building a linked list in TypeScript, applying classes
and generics.

## Type-check and run

The tsconfig has no `outDir`, so always type-check with `--noEmit` or `tsc`
writes `.js`, `.d.ts`, and `.map` files next to the source:

```sh
cd projects/linked-list
tsc --noEmit -p .
node linked-list.ts
```

Node 24 strips the types and runs the file directly. The tsconfig sets
`types: []`, so Node APIs such as `process` are not typed.
