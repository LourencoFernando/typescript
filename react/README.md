# React & TypeScript

Building React apps with TypeScript: typing components and props, state,
events, refs, and context, using a Vite React project.

`react-project/` was created with `npm create vite@latest` and the `react-ts`
template (React 19, TypeScript 7, Vite 8).

## Type-check, build, and run

```sh
cd react/react-project
npm ci           # install react, typescript, vite, and the type packages
npx tsc -b       # type-check both tsconfig projects (app and vite config)
npm run dev      # dev server with hot module replacement
npm run build    # tsc -b, then vite build into ignored dist/
npm run lint     # oxlint
```

The root `tsconfig.json` has no files of its own; it only references
`tsconfig.app.json` (the `src/` code, with DOM types) and
`tsconfig.node.json` (`vite.config.ts`, with Node types). That's why it uses
`tsc -b` (build mode) instead of `tsc -p .`. The referenced configs set
`noEmit`, and their `.tsbuildinfo` files go in `node_modules/.tmp/`.

The dev server strips types without checking them, so type errors don't stop
it. Run `npx tsc -b` (or `npm run build`) to catch them.

## Reading order

1. `react-project/tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`:
   project references and `"jsx": "react-jsx"`.
2. `react-project/src/main.tsx`: the entry point that renders `<App />` into
   `#root`.
3. `react-project/src/components/Header.tsx`: props typed with an interface,
   and `children?: ReactNode` for a wrapper component.
4. `react-project/src/components/LearningGoals.tsx`: an exported `Goal` type, a
   list rendered with `map` and `key`, and a callback prop (`onDelete`).
5. `react-project/src/components/NewGoal.tsx`: `useRef<HTMLInputElement>`
   and a form submit handler typed with `SubmitEvent<HTMLFormElement>`.
6. `react-project/src/App.tsx`: state typed by inference from `Goal[]`,
   updater functions, and passing data and callbacks down as props.

Comments in the scaffold files (`main.tsx`, `vite.config.ts`, the tsconfigs)
are kept as generated; notes about them go here.

## Linting

`npm run lint` runs oxlint, set up by the Vite template (`.oxlintrc.json`),
with React's rules-of-hooks and only-export-components rules. ESLint isn't
used because typescript-eslint supports only TypeScript below 6.1, and this
project uses TypeScript 7. In VS Code, the oxc extension shows oxlint's
warnings while typing.
