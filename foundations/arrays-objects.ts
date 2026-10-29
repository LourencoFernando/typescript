// 1. Arrays: inferred and explicit element types
// Type inference: the initial elements make hobbies a string[].
let hobbies = ["Sports", "Cooking"];

// Uncommenting this causes a type error: a number is not a string.
// hobbies.push(10);

// Each element may be either a string or a number.
// Parentheses make the union apply to the elements of the array.
let users: (string | number)[];
// The generic Array<T> notation expresses the same element type.
let usersGeneric: Array<string | number>;

// All three assignments satisfy (string | number)[].
users = ["John", "Jane"];
users = [1, 2, 3];
users = ["John", 1, "Jane", 2];

// 2. Tuples: a fixed number of elements with types at each position
// This tuple requires exactly two numbers, unlike number[].
let possibleResults: [number, number];

possibleResults = [1, -1];
// Uncommenting this causes a type error: the tuple only allows two elements.
// possibleResults = [1, 3, 5];

// 3. Objects: describe the shape and types of their properties
// age accepts a number or a string; role has its own nested object shape.
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

// 4. The {} type: it does not mean "an empty object"
// With strictNullChecks enabled, {} accepts any non-nullish value,
// including primitives such as strings, numbers, and booleans.
let val: {} = "is a value";

// 5. Records: objects with flexible keys and a shared value type
// Record<KeyType, ValueType> describes the allowed keys and values.
// Here, string keys map to values that can be numbers or strings.
let data: Record<string, number | string>;

data = {
    entry: 1,
    entry2: "some string",
};
