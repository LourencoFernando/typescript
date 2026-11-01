# TypeScript Compiler and Configuration

Notes and exercises for learning how to compile TypeScript and configure a project.

## Learning path

1. Compile a TypeScript file with `tsc` and inspect the generated JavaScript.
2. Create a `tsconfig.json` and explore project compilation.
3. Choose source files with `files`, `include`, and `exclude`.
4. Explore `target`, `lib`, `module`, and `moduleResolution`.
5. Organize output with `rootDir`, `outDir`, and source maps.
6. Compare type-checking and emission options, including `strict`, `noEmit`, and `noEmitOnError`.
7. Practice watch mode and inspect the effective configuration.

## How to study

Change one compiler option at a time. Predict its effect, run the compiler, and
compare the diagnostics and generated output with your prediction. Record when
the option would help in a real project and which tradeoffs it introduces.

Keep compiler experiments in this folder so their configuration can be explored
independently of the standalone examples in `foundations/`.

## Current example

`app.ts` demonstrates assignment checking, an explicit `any`, and a Node import.
The unused import and function let you experiment with `noUnusedLocals`.

With `tsc` available, install the Node type definitions with `npm ci` in this
folder, then run `tsc -p .` to compile or `tsc -p . --noEmit` to check types only.
The project writes JavaScript, declarations, and source maps to `dist/`.
Passing a source filename directly to `tsc` does not apply `tsconfig.json`;
use `-p` when exploring the project options.

## Configuration and generated output

The package uses ES modules (`"type": "module"`), with `module: "nodenext"`
and `verbatimModuleSyntax` preserving the Node import in the generated JavaScript.
`target: "esnext"` keeps modern syntax; the runtime must support the emitted
features. `types: ["node"]` loads the installed Node declarations.

`strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` enable
additional checks. Explicit `any` still bypasses operand checks in `add`.
`noEmitOnError` prevents new output when compilation reports errors, but does
not remove output from earlier builds. `allowJs: false` keeps JavaScript files
out of the compiler inputs.

The generated files are committed in this exercise so you can compare them
with the source after changing compiler options:

- `dist/app.js`: executable JavaScript with TypeScript annotations removed.
- `dist/app.js.map`: maps generated JavaScript back to `app.ts` for debugging.
- `dist/app.d.ts`: exported type declarations; currently just `export {}`
  because the example exports no API.
- `dist/app.d.ts.map`: maps declarations back to their TypeScript source.

Run `tsc -p .` after editing `app.ts` or emission options, and review the source
and generated files together. Run `node dist/app.js` to print `Melody`.
Only `node_modules/` is ignored in this folder; `dist/` remains tracked.
