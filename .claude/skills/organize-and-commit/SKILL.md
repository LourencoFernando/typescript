---
name: organize-and-commit
description: Organize TypeScript learning examples with short comments and practical design notes, validate them, and commit when the user requests this workflow.
argument-hint: "[files to organize]"
disable-model-invocation: true
---

Organize the requested learning examples and create a focused local Git commit.
Follow the repository's CLAUDE.md and AGENTS.md guidance.

Files to organize (empty means infer from Git status): $ARGUMENTS

- Inspect Git status and diffs, including untracked files. Use files named by the
  user; otherwise focus on new or modified TypeScript examples. Ask only if the
  intended scope cannot be inferred.
- Group related examples, normalize formatting, and add short comments explaining
  the concepts. Preserve behavior, commented-out alternatives, and intentional
  type-error demonstrations. Avoid adding abstractions or dependencies.
- At the end of each organized TypeScript file, add a concise block comment
  titled "Use cases and architectural decisions". Tie practical examples to the
  concepts actually studied in that file: where they fit in a real application,
  why to choose them, and relevant tradeoffs or runtime limitations. Prefer a few
  concrete notes over generic advice; compare alternatives only when useful to
  the decision. Update an existing closing block instead of duplicating it.
- Type-check each changed TypeScript file separately with
  `tsc --noEmit --strict <file>`. Examples reuse global names, so do not compile
  them together. For files in a folder with its own `tsconfig.json` (such as
  `compiler/` or `projects/*`), run `tsc --noEmit -p .` in that folder instead
  so its options apply. If the compiler is unavailable, report that limitation. Resolve
  unexpected failures before committing; preserve intentional demonstrations.
- Review the final diff and run `git diff --check`. Stage the intended files by
  explicit path, then inspect the staged diff and run `git diff --cached --check`.
  Keep unrelated changes out of the commit. If unrelated files were already
  staged, preserve their staged state and commit only the intended paths.
- Commit with a concise conventional message describing the actual change.
  Invoking this skill authorizes its local commit workflow; do not push or amend
  existing commits unless requested. If there are no relevant changes, report
  that without creating an empty commit.
- Report the changes, validation outcome, commit hash, and any remaining changes.
