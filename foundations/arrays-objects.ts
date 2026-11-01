// Inferred as string[].
let hobbies = ["Sports", "Cooking"];

// hobbies.push(10);

// Each element can be a string or number.
let users: (string | number)[];
// Equivalent to (string | number)[].
let usersGeneric: Array<string | number>;

users = ["John", "Jane"];
users = [1, 2, 3];
users = ["John", 1, "Jane", 2];

// Tuple: exactly two numbers.
let possibleResults: [number, number];

possibleResults = [1, -1];
// possibleResults = [1, 3, 5];

// Nested objects have their own property types.
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

// {} accepts non-nullish values, including primitives (strictNullChecks).
let val: {} = "is a value";

// String keys with string or number values.
let data: Record<string, number | string>;

data = {
    entry: 1,
    entry2: "some string",
};
