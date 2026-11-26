// Vite handles non-TypeScript imports. The `vite/client` entry in
// `types` declares them: a CSS import is a side effect (Vite injects the
// styles), and an asset import gives the final URL of the file as a `string`.
import "./style.css";
import heroImg from "./assets/hero.png";
import typescriptLogo from "./assets/typescript.svg";
import viteLogo from "./assets/vite.svg";
// `allowImportingTsExtensions` allows the `.ts` extension. It only works with
// `noEmit`, because the bundler (not `tsc`) resolves and builds the files.
import { setupCounter } from "./counter.ts";

// `querySelector<HTMLDivElement>` sets the result type to
// `HTMLDivElement | null`; the `!` non-null assertion removes `null`.
// It is unchecked: if `#app` is missing from `index.html`, this throws at runtime.
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="counter" type="button" class="counter"></button>
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank">
          <img class="logo" src="${viteLogo}" alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://www.typescriptlang.org" target="_blank">
          <img class="button-icon" src="${typescriptLogo}" alt="">
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
      <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
      <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
      <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
`;

// The generic argument makes the result match `setupCounter`'s parameter type.
setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

/*
Use cases and architectural decisions

- Importing CSS and images from TypeScript lets Vite track them as
  dependencies: unused assets are left out of the build, and the files get
  hashed names for caching. Files in `public/` (such as `/icons.svg`) are
  copied as-is and referenced by an absolute path instead.
- With Vite, `tsc` only type-checks (`noEmit`). Vite strips the types on its
  own, file by file, without type-checking, so the dev server keeps running
  with type errors; the `build` script runs `tsc` first to catch them.
- Per-file transpiling is why the tsconfig enables `verbatimModuleSyntax`
  (type-only imports need `import type`) and `erasableSyntaxOnly` (no `enum`
  or parameter properties, which need code generation rather than removal).
- The `!` assertions keep the starter short. In an app that renders into
  markup it doesn't control, check for `null` and fail with a clear message.
*/
