# Repository guidance

## Purpose and layout

This is a TypeScript learning repository, progressing from language fundamentals
to architecture. Keep examples small, readable, and focused on the concept being
studied.

- `README.md` describes the learning goals.
- `foundations/README.md` contains the reading order and study questions.
- `foundations/*.ts` are standalone learning examples, not a single application.

## Editing examples

- Match the existing style: four-space indentation, double quotes, and semicolons.
- Add short comments explaining TypeScript behavior or the reason for a check.
- Preserve commented-out alternatives and intentional type-error examples; they
  are part of the exercises.
- Preserve the concept being demonstrated, including intentional uses of `any`,
  type assertions, and functions that throw.
- Avoid introducing frameworks, dependencies, or shared abstractions for small
  exercises unless the task calls for them.
- When adding a topic, update the foundations reading guide when relevant.

## Validation

There is currently no package manifest, tsconfig, or automated test suite. If `tsc`
is available, type-check each changed example separately:

```sh
tsc --noEmit --strict foundations/optional.ts
tsc --noEmit --strict foundations/unknown.ts
```

Substitute the changed filename. Do not compile all examples together: their
global declarations reuse names and can conflict. The forms example needs DOM
types and a browser document to run. Some other examples intentionally throw, so
type-checking is usually more useful than executing every file.

For documentation-only edits, review the Markdown and run `git diff --check`.

## Git workflow

Keep changes scoped to the request and preserve unrelated work. When asked to
commit, stage the intended files explicitly and use a concise conventional commit
message, matching existing prefixes such as `docs:` and `feat:`.
