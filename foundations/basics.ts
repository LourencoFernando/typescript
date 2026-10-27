// Explicit annotation: userName must hold a string when assigned.
let userName: string;
// Type inference: TypeScript infers number from the initial value.
let userAge = 30;

userName = "John Doe";

// a has an explicit type; b is inferred as number from its default value.
// The return type is also inferred as number.
function add(a: number, b = 5) {
    return a + b;
}

// Omitting b uses the default value of 5.
add(10); // returns 15
