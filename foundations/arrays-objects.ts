// Inferred as string[].
let hobbies = ["Sports", "Cooking"];

// hobbies.push(10); // Error: number is not assignable to string.

// Parentheses make the union apply to each array element.
let users: (string | number)[];
// Equivalent to (string | number)[].
let usersGeneric: Array<string | number>;

users = ["John", "Jane"];
users = [1, 2, 3];
users = ["John", 1, "Jane", 2];

// A tuple requires two numbers in these positions.
let possibleResults: [number, number];

possibleResults = [1, -1];
// possibleResults = [1, 3, 5]; // Error: too many elements.

let user: {
    name: string;
    age: number | string;
    hobbies: string[];
    role: {
        id: number;
        description: string;
    };
} = {
    name: "Max",
    age: 38,
    hobbies: ["Sports", "Cooking"],
    role: {
        id: 5,
        description: "admin",
    },
};

// With strictNullChecks, {} accepts any non-nullish value, including primitives.
let val: {} = "is a value";

// String keys with string or number values.
let data: Record<string, number | string>;

data = {
    entry: 1,
    entry2: "some string",
};
