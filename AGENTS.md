# Repository guidance

## Purpose and layout

This is a TypeScript learning repository (Udemy course notes plus experiments),
progressing from language fundamentals to architecture. Keep examples small,
readable, and focused on the concept being studied.

- `README.md` describes the learning goals and the reading order of the folders.
- Each folder has (or should get) a `README.md` with a reading order and study
  notes. Update the relevant one when adding a topic.

The folders are checked and run differently:

| Area | What it is | Type-check | Run |
| --- | --- | --- | --- |
| `foundations/`, `classes & Interfaces/`, `advanced types/`, `generic types/`, `deriving types/`, `ecmascript decorators/` | Standalone single-file examples, not a single application; no tsconfig | `tsc --noEmit --strict <folder>/<file>.ts` (one file at a time) | Usually not run; some throw on purpose, `foundations/forms.ts` needs a browser DOM |
| `compiler/` | Compiler-option experiments with `package.json` (`@types/node`) | `cd compiler && npm ci && tsc -p . --noEmit` | `tsc -p .` then `node dist/app.js` |
| `projects/first-typescript-project/` | First practice project (investment calculator, work in progress) | `cd projects/first-typescript-project && tsc --noEmit -p .` | `node calculator.ts` (Node 24 strips types) |
| `projects/linked-list/` | Generic singly linked list (simple starting point) | `cd projects/linked-list && tsc --noEmit -p .` | `node linked-list.ts` (Node 24 strips types; no parameter properties) |
| `projects/drag-and-drop/` | Browser drag & drop app | `cd projects/drag-and-drop && npm ci && tsc --noEmit -p .` | `tsc -p .` (writes ignored `dist/`), then `npm start` (`browser-sync`) |
| `modules & namespaces/` | The drag & drop app split into ES modules (namespace version in history) | `cd "modules & namespaces" && npm ci && tsc --noEmit -p .` | `tsc -p .` (writes ignored `dist/`), then `npm start` (`browser-sync`, served over HTTP for modules) |
| `vite/vite-project/` | Vite vanilla TypeScript starter (TypeScript 7, Vite 8) | `cd vite/vite-project && npm ci && npx tsc --noEmit -p .` | `npm run dev` (dev server, strips types without checking); `npm run build` runs `tsc` then writes ignored `dist/` |

## Compiler configuration

Passing a filename to `tsc` ignores `tsconfig.json`. Use `-p .` inside
`compiler/` and the project folders.

- `compiler/dist/` is committed on purpose so the output can be compared after
  changing options. Rebuild it with `tsc -p .` when `app.ts` or emission options
  change. `noEmitOnError` is on.
- `projects/drag-and-drop/` is the exception among the projects: it uses the
  course's tsconfig (`experimentalDecorators`, `noEmitOnError`, no
  `noUncheckedIndexedAccess`), compiles `src/` to `dist/` (git-ignored), and
  the page loads `dist/app.js` as a plain script.
- The other project folders' tsconfigs have no `outDir` but enable `declaration`
  and `sourceMap`. Always use `--noEmit` there, or `tsc` writes `.js`, `.d.ts`,
  and `.map` files next to the source. They set `types: []`, so Node APIs such
  as `process` are not typed.
- The other tsconfigs use `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, and `moduleDetection: "force"`. That last option
  makes each file a module, so names don't collide the way they do across the
  standalone example files.

## Editing examples

- Match the existing style: four-space indentation, double quotes, and semicolons.
- Add short comments explaining TypeScript behavior or the reason for a check.
- Preserve commented-out alternatives and intentional type-error examples; they
  are part of the exercises.
- Preserve the concept being demonstrated, including intentional uses of `any`,
  type assertions, and functions that throw.
- Avoid introducing frameworks, dependencies, or shared abstractions for small
  exercises unless the task calls for them.
- `projects/first-typescript-project/calculator.ts` is in-progress course work.
  It returns an error `string` instead of throwing, and `printResults` narrows
  the `InvestmentResult[] | string` union. Keep that design (it is the concept
  being practiced) and don't rework the logic beyond what is asked.

The project skill `/organize-and-commit`
(`.claude/skills/organize-and-commit/SKILL.md`) is the workflow for tidying,
commenting, validating, and committing examples. One of its steps adds a
closing "Use cases and architectural decisions" block comment to each file.

## Validation

There is no automated test suite. Type-check each changed standalone example
separately:

```sh
tsc --noEmit --strict foundations/optional.ts
tsc --noEmit --strict foundations/unknown.ts
```

Substitute the changed filename. Do not compile the standalone examples
together: their global declarations reuse names and can conflict. Some examples
intentionally throw, so type-checking is usually more useful than executing
every file. In `compiler/` and `projects/*`, run `tsc --noEmit -p .` inside the
folder instead, so its tsconfig applies.

For documentation-only edits, review the Markdown and run `git diff --check`.

## Git workflow

Keep changes scoped to the request and preserve unrelated work. When asked to
commit, stage the intended files explicitly and use a concise conventional commit
message, matching existing prefixes such as `docs:` and `feat:`.
