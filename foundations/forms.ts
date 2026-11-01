// const inputEl = document.getElementById('user-name')!;

// Assertions guide TypeScript; they do not validate the DOM.
const inputEl = document.getElementById("user-name") as HTMLInputElement | null;

// Check for a missing element at runtime.
if (!inputEl) {
    throw new Error("Element not found!");
}

console.log(inputEl?.value);
