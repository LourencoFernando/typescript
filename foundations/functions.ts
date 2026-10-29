function add(a: number, b: number): number {
    return a + b;
}

function log(message: string): void {
    console.log(message);
}

// never means the function cannot return normally.
function logAndThrow(errorMessage: string): never {
    console.log(errorMessage);
    throw new Error(errorMessage);
}

function performJob(cb: (msg: string) => void) {
    cb("Job Done!!");
}

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
    }
};
