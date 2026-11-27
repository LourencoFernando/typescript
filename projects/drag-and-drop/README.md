# Drag & Drop

A practice project for a browser app in TypeScript: add projects through a
form and drag them between "active" and "finished" lists. It applies classes,
generics, abstract classes, interfaces, enums, DOM types, union types, tuples,
a method decorator, and native drag and drop.

## How it works

- `ProjectInput` renders the form from the `#project-input` template, validates
  the inputs with `validate` on submit, and adds a project to the state.
- `ProjectState` is a singleton that stores the projects and notifies its
  listeners after `addProject` or `moveProject`. It extends the generic
  `State<T>`, which holds the listener list.
- `ProjectList` renders the "active" or "finished" list from the
  `#project-list` template, listens to the state, and re-renders the projects
  with a matching `ProjectStatus`.
- `ProjectItem` renders one project from the `#single-project` template as a
  draggable `<li>`.
- All three components extend the abstract `Component<T, U>`, which clones a
  template and attaches it to a host element.
- Dragging an item stores its id in `dataTransfer`. Dropping it on the other
  list calls `moveProject`, and both lists re-render from the new state.

## Layout

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and the `<template>` elements; loads `dist/app.js` |
| `app.css` | Styles |
| `src/app.ts` | TypeScript source |
| `dist/` | Compiled JavaScript (ignored by git) |
| `package.json` | `browser-sync` dev dependency and the `start` script |

## Type-check, build, and run

The tsconfig compiles `src/` to `dist/`, so the browser loads plain
JavaScript. `noEmitOnError` is on, so a type error leaves `dist/` unchanged.

```sh
cd projects/drag-and-drop
npm ci              # install browser-sync
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
- `ProjectItem` implements `Draggable` and `ProjectList` implements
  `DragTarget`, so the compiler requires every drag handler. A list only
  accepts a drop if `dragOverHandler` calls `event.preventDefault()`, which it
  does only for `text/plain` data.
- `event.dataTransfer` is typed `DataTransfer | null`, so the handlers use `!`
  or a check before reading it.
- The tsconfig uses an older setup (`target: es6`, `module: commonjs`)
  and doesn't enable `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`
  like the other projects. With no imports or exports, `app.ts` is a script, so
  `module` doesn't affect the output.
- `npm start` runs `browser-sync` directly instead of `lite-server`, a common
  choice for this kind of setup. Every version of `lite-server` depends on an
  old `browser-sync` with vulnerable dependencies (`axios`, `send`) and no fix. `browser-sync` 3.0.4 audits clean
  and reloads the page when `index.html`, `app.css`, or `dist/` changes.
