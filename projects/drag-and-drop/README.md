# Drag & Drop

A practice project (work in progress) for a browser app in TypeScript: add
projects through a form and drag them between "active" and "finished" lists.
It applies classes, DOM types, interfaces, union types, tuples, and a method
decorator.

## Current state

- `ProjectInput` renders the form from the `#project-input` template, validates
  the inputs on submit, and logs them.
- `ProjectList` renders the "active" and "finished" lists from the
  `#project-list` template.
- `validate` checks a `Validatable` object (required, min/max length, min/max
  value). Storing projects, rendering them in the lists, and drag events are
  left for later iterations.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and the `<template>` elements; loads `dist/app.js` |
| `app.css` | Styles |
| `src/app.ts` | TypeScript source |
| `dist/` | Compiled JavaScript (ignored by git) |
| `package.json` | `lite-server` dev dependency and the `start` script |

## Type-check, build, and run

The tsconfig compiles `src/` to `dist/`, so the browser loads plain
JavaScript. `noEmitOnError` is on, so a type error leaves `dist/` unchanged.

```sh
cd projects/drag-and-drop
npm ci              # install lite-server
tsc --noEmit -p .   # type-check only
tsc -p . --watch    # build dist/app.js and rebuild on save
npm start           # serve the folder and reload the browser on changes
```

## Study notes

- `experimentalDecorators` is on, so `@autobind` uses the older TypeScript
  decorator signature `(target, name, descriptor)` and returns a new
  `PropertyDescriptor`. This differs from the ECMAScript decorators in
  `ecmascript decorators/`, which receive `(value, context)`.
- `autobind` replaces the method with a getter that returns it bound to the
  instance. Without it, `addEventListener` would call `submitHandler` with
  `this` set to the form element.
- The tsconfig is the course's older setup (`target: es6`, `module: commonjs`)
  and doesn't enable `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`
  like the other projects. With no imports or exports, `app.ts` is a script, so
  `module` doesn't affect the output.
- `npm audit` reports vulnerabilities in `lite-server`'s dependencies with no
  fix available. It's only a local development server.
