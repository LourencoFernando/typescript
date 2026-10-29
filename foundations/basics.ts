let userName: string;
let userAge = 30; // Inferred as number.

userName = "John Doe";

function add(a: number, b = 5) {
    return a + b;
}

add(10); // returns 15
