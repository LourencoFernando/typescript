# TypeScript: From Fundamentals to Architecture

A learning project for understanding TypeScript deeply, from basic concepts to advanced features, with the perspective of a software architect in the AI era.

The goal is to explain how the language works, why a design makes sense, and which tradeoffs it introduces—and then put that understanding into practice.

**Status:** the planned topics are covered. The projects may get further
iterations, and the topics under "Next steps" are still to be explored.

## Learning focus

Covered by the examples and projects:

- **Fundamentals:** types, inference, functions, objects, unions, and narrowing.
- **Advanced features:** generics, conditional and mapped types, utility types, and type-level programming.
- **Language foundations:** structural typing, assignability, compiler behavior, and the boundary between compile-time types and JavaScript runtime behavior.
- **Practice:** small projects that connect concepts to real design decisions, from a CLI calculator to browser apps with third-party libraries and React.

Next steps:

- **Paradigms:** object-oriented, functional, and composition-based approaches and their tradeoffs.
- **Architecture:** domain modeling, module boundaries, dependency management, API design, and maintainability.

## Learning with AI

Use AI to explore ideas, compare approaches, challenge assumptions, and review implementations. Build the ability to explain, validate, and improve generated code independently.

For each topic:

1. Understand the concept and the problem it solves.
2. Implement a small example and explore its limits.
3. Compare alternatives and explain the tradeoffs.
4. Record what it means for larger systems and architectural decisions.

## Prerequisites

- **Node.js 24:** it runs `.ts` files directly by stripping the types
  (`node file.ts`), as long as they don't use syntax that generates code, such as
  `enum` or parameter properties.
- **A global `tsc`** (`npm install -g typescript`) for the standalone examples,
  `compiler/`, and the projects without their own TypeScript dependency.
- **npm:** the folders with a `package.json` need `npm ci` first. The Vite,
  Share a Place, and React projects install TypeScript 7 locally, so use
  `npx tsc` there.

## Exercises and notes

Follow the folders in this order. Each one has a README with a reading order,
concept notes, and study questions.

1. [TypeScript Foundations](foundations/README.md): types, inference, functions, objects, unions, and narrowing.
2. [TypeScript Compiler and Configuration](compiler/README.md): compilation, project configuration, and compiler options.
3. [First TypeScript Project](projects/first-typescript-project/README.md): an investment calculator that applies the basics, built step by step.
4. [Classes & Interfaces](classes%20%26%20Interfaces/README.md): class features, inheritance, and object contracts.
5. [Advanced Types](advanced%20types/README.md): intersections, type guards, function overloads, index signatures, `as const`, and `satisfies`.
6. [Generic Types](generic%20types/README.md): generic type aliases, functions, constraints, and classes.
7. [Linked List](projects/linked-list/README.md): a project that practices classes and generics, as a simple starting point for a generic data structure.
8. [Deriving Types from Types](deriving%20types/README.md): `typeof`, `keyof`, indexed access, mapped, template literal, and conditional types with `infer`.
9. [ECMAScript Decorators](ecmascript%20decorators/README.md): class, method, and field decorators and decorator factories.
10. [Drag & Drop](projects/drag-and-drop/README.md): a browser project that practices classes, generics, interfaces, DOM types, validation, a method decorator, and native drag and drop.
11. [Modules & Namespaces](modules%20%26%20namespaces/README.md): splitting code across files with namespaces and ES modules.
12. [Vite](vite/README.md): creating and running TypeScript projects with Vite.
13. [Share a Place](projects/share-a-place/README.md): a project that practices using a third-party library and its types.
14. [React & TypeScript](react/README.md): building React components with typed props, state, and events.

## Type-checking and running

The standalone example folders have no `tsconfig.json`. Type-check them one file
at a time with `tsc --noEmit --strict <file>`: compiling them together fails
because the files reuse names.

The compiler folder and the projects have their own `tsconfig.json`, and the
exact commands differ (`tsc -p .`, `npx tsc -p .`, or `npx tsc -b` for React).
Each folder's README lists its type-check, build, and run commands.
