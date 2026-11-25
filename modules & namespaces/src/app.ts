// Entry point: `index.html` loads only this file with
// `<script type="module" src="dist/app.js">`. The browser follows the imports
// below, evaluates each module once (dependencies first), and then runs this
// file, so the order of files no longer depends on `<script>` tags.
import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";

// The constructors render and wire up everything; the instances don't need to
// be stored.
new ProjectInput();
new ProjectList("active");
new ProjectList("finished");

/*
 * Use cases and architectural decisions
 *
 * - One entry module is the standard shape of a front-end app: bundlers and
 *   dev servers start from it and follow its imports to build the dependency
 *   graph. Only this file has top-level side effects; the other modules just
 *   export, so importing them never renders anything by accident.
 *
 * - Module scripts are deferred by default and run in strict mode, and each
 *   module has its own scope: none of these names leak onto `window`, unlike
 *   the global `var App` that the namespace version created.
 *
 * - The browser blocks module scripts loaded from `file://`, so the page must
 *   be served over HTTP (`npm start`). TypeScript 7 removed `outFile` with
 *   `module: "amd"`, so producing a single bundled file now needs a bundler
 *   such as Vite or esbuild.
 */
