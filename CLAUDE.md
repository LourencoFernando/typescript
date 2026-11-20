# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Repository layout

A TypeScript learning repository (Udemy course notes plus experiments). The
three top-level areas are checked and run differently:

| Area | What it is | Type-check | Run |
| --- | --- | --- | --- |
| `foundations/` | Standalone single-file examples; no tsconfig | `tsc --noEmit --strict foundations/<file>.ts` (one file at a time) | Usually not run; some throw on purpose, `forms.ts` needs a browser DOM |
| `compiler/` | Compiler-option experiments with `package.json` (`@types/node`) | `cd compiler && npm ci && tsc -p . --noEmit` | `tsc -p .` then `node dist/app.js` |
| `projects/first-typescript-project/` | First practice project (investment calculator, work in progress) | `cd projects/first-typescript-project && tsc --noEmit -p .` | `node calculator.ts` (Node 24 strips types) |
| `projects/linked-list/` | Generic singly linked list (simple starting point) | `cd projects/linked-list && tsc --noEmit -p .` | `node linked-list.ts` (Node 24 strips types; no parameter properties) |
| `projects/drag-and-drop/` | Browser drag & drop app (work in progress) | `cd projects/drag-and-drop && npm ci && tsc --noEmit -p .` | `tsc -p .` (writes ignored `dist/`), then `npm start` (`lite-server`) |

Passing a filename to `tsc` ignores `tsconfig.json`. Use `-p .` inside
`compiler/` and the project folder.

- `compiler/dist/` is committed on purpose so the output can be compared after
  changing options. Rebuild it with `tsc -p .` when `app.ts` or emission options
  change. `noEmitOnError` is on.
- `projects/drag-and-drop/` is the exception among the projects: it uses the
  course's tsconfig (`experimentalDecorators`, `noEmitOnError`, no
  `noUncheckedIndexedAccess`), compiles `src/` to `dist/` (git-ignored), and
  the page loads `dist/app.js` as a plain script. `src/app.ts` is in-progress
  course work: don't add comments or rework it unless asked.
- The other project folders' tsconfigs have no `outDir` but enable `declaration` and
  `sourceMap`. Always use `--noEmit` there, or `tsc` writes `.js`, `.d.ts`, and
  `.map` files next to the source. They set `types: []`, so Node APIs such as
  `process` are not typed.
- The other tsconfigs use `strict`, `noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`, and `moduleDetection: "force"`. That last option
  makes each file a module, so names don't collide the way they do across
  `foundations/` files.

Each area has (or should get) a `README.md` with a reading order and study
notes. Update the relevant one when adding a topic. The project skill
`/organize-and-commit` (`.claude/skills/organize-and-commit/SKILL.md`) is the
workflow for tidying, commenting, validating, and committing examples. One of
its steps adds a closing "Use cases and architectural decisions" block comment
to each file.

## Notes beyond AGENTS.md

- `AGENTS.md` predates `compiler/` and the project folder. Its "no tsconfig"
  statement applies only to `foundations/`.
- `projects/first-typescript-project/calculator.ts` is in-progress course work.
  It returns an error `string` instead of throwing, and `printResults` narrows
  the `InvestmentResult[] | string` union. Keep that design (it is the concept
  being practiced) and don't rework the logic beyond what is asked.
