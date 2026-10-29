// A type assertion does not check the element type at runtime.
const inputEl = document.getElementById("user-name") as HTMLInputElement | null;

if (!inputEl) {
    throw new Error("Element not found!");
}

console.log(inputEl?.value);
