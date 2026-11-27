# Modules & Namespaces

The drag & drop app from `projects/drag-and-drop/`, split across files in two
ways: first with namespaces (`namespace` blocks and triple-slash references),
then with ES modules (`import` and `export`). The current code uses ES modules;
the namespace version is in the commit history.

## Layout

| Path | Purpose |
| --- | --- |
| `src/app.ts` | Entry module: imports the components and creates them |
| `src/components/` | `Component` base class (default export), `ProjectInput`, `ProjectItem`, `ProjectList` |
| `src/models/` | `Project`, `ProjectStatus`, and the `Draggable`/`DragTarget` interfaces |
| `src/state/project-state.ts` | Singleton store with listeners |
| `src/utils/validation.ts` | `Validatable` and `validate` |
| `src/decorators/autobind.ts` | Legacy method decorator that binds `this` |
| `index.html` | Loads `dist/app.js` with `<script type="module">` |
| `dist/` | Compiled JavaScript (ignored by git) |

## Type-check, build, and run

```sh
cd "modules & namespaces"
npm ci              # install browser-sync
tsc --noEmit -p .   # type-check only
tsc -p . --watch    # build dist/ and rebuild on save
npm start           # serve the folder and reload the browser on changes
```

Open the page through `npm start`: browsers block module scripts loaded from
`file://`.

## Reading order

1. `src/models/drag-drop.ts` and `src/models/project.ts`: modules with only
   exports; type-only exports compile to an empty module.
2. `src/utils/validation.ts` and `src/decorators/autobind.ts`: small utility
   modules.
3. `src/state/project-state.ts`: a named import, an unexported helper class,
   and an exported instance.
4. `src/components/base-component.ts`: a default export.
5. `src/components/project-input.ts`: default, renamed (`as`), and namespace
   (`* as`) imports.
6. `src/components/project-item.ts` and `src/components/project-list.ts`:
   import elision for type-only imports.
7. `src/app.ts`: the entry module that `index.html` loads.

## Study notes

- **Namespaces:** each file wrapped its code in `namespace App { ... }` and
  exported members. The compiled files share one global `var App`, so the
  browser needed one `<script>` tag per file, dependencies first.
  `/// <reference path>` lines only told TypeScript which files to read for
  types; they load nothing at runtime.
- **TypeScript 7:** namespaces were traditionally bundled into one file with
  `"module": "amd"` and `outFile`. TypeScript 7 removed both (TS5108, TS5102),
  and 6.0 only accepts them with `"ignoreDeprecations": "6.0"`. The namespace
  version here therefore compiled each file separately and listed the
  `<script>` tags by hand.
- **ES modules:** a file with `import` or `export` gets its own scope. The
  browser loads `dist/app.js`, follows its imports, and evaluates each module
  once, dependencies first. Import paths end in `.js` because TypeScript
  doesn't rewrite them and the browser requests the compiled files.
- **Import elision:** imports used only as types (`Draggable`, `DragTarget`,
  `Validatable`) are removed from the compiled JavaScript. `import type` makes
  that explicit and is required with `verbatimModuleSyntax`.
- **One bundle:** without `outFile`, a single output file now needs a bundler
  such as Vite, esbuild, or webpack.

## Conclusion: prefer ES modules

After writing both versions, ES modules are more convenient than namespaces:

- **Loading:** `index.html` has one `<script type="module">` tag, and the
  browser loads the rest by following the imports. The namespace version
  needed one tag per file in the right order, and a missing or misplaced tag
  only failed at runtime, even when `tsc` passed.
- **Dependencies:** each file's imports show exactly what it uses and where it
  comes from. With namespaces, every exported name went into the shared
  `App` object, and `/// <reference>` lines only listed files for the
  compiler.
- **Scope:** a module's names stay private unless exported, so nothing leaks
  onto `window`.
- **Tooling:** TypeScript 7 removed the `outFile` and `module: "amd"` options
  that made namespaces practical. Bundlers, editors, and Node all work with
  ES modules.

Namespaces are still useful to recognize in older code and in `.d.ts` files
that describe global libraries, but new multi-file code should use ES modules.

## Study questions

- How does a namespace differ from an ES module, and why do modern projects
  prefer modules?
- Why does a file with `import` or `export` stop sharing global names with
  other files?
- Why did the namespace version fail at runtime when a `<script>` tag was
  missing, even though `tsc` passed?
- Why is `dist/models/drag-drop.js` never requested by the browser?
- What changes for importers if `base-component.ts` switches from
  `export default` to a named export?
- Why is `getInstance()` no longer what guarantees a single `projectState`?
