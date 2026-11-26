// A named export: `main.ts` imports it with `import { setupCounter } from "./counter.ts"`.
// The parameter type `HTMLButtonElement` comes from the "DOM" entry in `lib`.
export function setupCounter(element: HTMLButtonElement) {
    // `counter` is inferred as `number` from its initial value.
    let counter = 0;
    // The closure keeps `counter` private to this button; there is no global state.
    const setCounter = (count: number) => {
        counter = count;
        element.innerHTML = `Count is ${counter}`;
    };
    element.addEventListener("click", () => setCounter(counter + 1));
    setCounter(0);
}

/*
Use cases and architectural decisions

- A function that receives the element it controls (instead of querying the
  DOM itself) is easy to reuse: call it once per button, and each call gets
  its own `counter` through the closure.
- Typing the parameter as `HTMLButtonElement` rather than `HTMLElement`
  documents the expected element and lets the compiler reject a wrong one at
  the call site. The type is erased at runtime, so the caller still has to
  pass a real button.
- `innerHTML` is fine here because the text is a number built by the code.
  For user-provided text, prefer `textContent` to avoid injecting HTML.
*/
