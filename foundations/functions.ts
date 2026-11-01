// The return annotation requires a number.
function add(a: number, b: number): number {
    return a + b;
}

// void: no return value for callers to use.
function log(message: string): void {
    console.log(message);
}

// never means the function cannot return normally.
function logAndThrow(errorMessage: string): never {
    console.log(errorMessage);
    throw new Error(errorMessage);
}

// The callback accepts a string and returns no usable value.
function performJob(cb: (msg: string) => void) {
    cb("Job Done!!");
}

// Object types can include method signatures.
type User = {
    name: string;
    age: number;
    greet: () => string;
};

let user: User = {
    name: "Max",
    age: 39,
    greet() {
        console.log("Hello, there!!");
        return this.name;
    },
};
