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

Passing a filename to `tsc` ignores `tsconfig.json`. Use `-p .` inside
`compiler/` and the project folder.

- `compiler/dist/` is committed on purpose so the output can be compared after
  changing options. Rebuild it with `tsc -p .` when `app.ts` or emission options
  change. `noEmitOnError` is on.
- The project folder's tsconfig has no `outDir` but enables `declaration` and
  `sourceMap`. Always use `--noEmit` there, or `tsc` writes `.js`, `.d.ts`, and
  `.map` files next to the source. It sets `types: []`, so Node APIs such as
  `process` are not typed.
- Both tsconfigs use `strict`, `noUncheckedIndexedAccess`,
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
