# Linked List

A practice project for building a linked list in TypeScript, applying classes
and generics. It is a simple starting point: a generic singly linked list that
can append values, count them, and print them. Removing, finding, and
inserting are left for later iterations.

## Type-check and run

The tsconfig has no `outDir`, so always type-check with `--noEmit` or `tsc`
writes `.js`, `.d.ts`, and `.map` files next to the source:

```sh
cd projects/linked-list
tsc --noEmit -p .
node linked-list.ts
```

Node 24 strips the types and runs the file directly. Stripping can't handle
syntax that generates code, such as `constructor(public value: T)` parameter
properties or `enum`, so `ListNode` declares its `value` field explicitly.
`tsc` accepts both forms. The tsconfig sets `types: []`, so Node APIs such as
`process` are not typed.
