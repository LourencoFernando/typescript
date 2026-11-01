let userName: string; // Explicit type.
let userAge = 30; // Inferred as number.

userName = "John Doe";

// Default parameters and return types can be inferred.
function add(a: number, b = 5) {
    return a + b;
}

add(10); // returns 15
