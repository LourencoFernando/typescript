# Vite

Creating and running TypeScript projects with Vite: scaffolding a project,
running the dev server, and building for production.

`vite-project/` was created with `npm create vite@latest` and the vanilla
TypeScript template. It uses the template's own tsconfig and formatting
defaults, except for the commented `.ts` files.

## Layout

| Path | Purpose |
| --- | --- |
| `vite-project/index.html` | Entry point: loads `/src/main.ts` directly with `<script type="module">` |
| `vite-project/src/main.ts` | Imports CSS, images, and the counter module, then renders the page |
| `vite-project/src/counter.ts` | `setupCounter`, a named export that keeps its state in a closure |
| `vite-project/src/assets/` | Assets imported from TypeScript (bundled, hashed names) |
| `vite-project/public/` | Static files copied as-is and referenced by absolute path |
| `vite-project/tsconfig.json` | Bundler-mode options with `noEmit`: `tsc` only type-checks |
| `vite-project/dist/` | Production build (ignored by git) |

## Type-check, build, and run

```sh
cd vite/vite-project
npm ci                 # install typescript and vite
npx tsc --noEmit -p .  # type-check only (uses the project's TypeScript 7)
npm run dev            # dev server with hot module replacement
npm run build          # tsc, then vite build into dist/
npm run preview        # serve the built dist/ locally
```

The dev server strips types file by file without checking them, so type
errors don't stop it. Run `tsc` (or `npm run build`) to catch them.

## Reading order

1. `vite-project/index.html`: Vite serves the HTML and the `.ts` entry as-is;
   no `dist/` is needed during development.
2. `vite-project/tsconfig.json`: `moduleResolution: "bundler"`, `noEmit`,
   `allowImportingTsExtensions`, `verbatimModuleSyntax`, `erasableSyntaxOnly`,
   and `types: ["vite/client"]`.
3. `vite-project/src/counter.ts`: a small module with a named export.
4. `vite-project/src/main.ts`: CSS and asset imports, `.ts` import paths, and
   `querySelector` with a generic and a non-null assertion.

## Study questions

- Why does the tsconfig set `noEmit` when the app still needs JavaScript?
- What does `vite/client` add, and what would fail to type-check without it?
- When should an asset go in `src/assets/` instead of `public/`?
