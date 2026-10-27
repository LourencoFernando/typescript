// Array inference: the initial elements make hobbies a string[].
let hobbies = ["Sports", "Cooking"];

// Uncommenting this causes a type error: a number is not a string.
// hobbies.push(10);

// Each element may be either a string or a number.
// Parentheses make the union apply to the elements of the array.
let users: (string | number)[];
// The generic Array<T> notation expresses the same element type.
let usersGeneric: Array<string | number>;

// All three assignments satisfy (string | number)[].
users = ["John","Jane"];
users = [1, 2, 3];
users = ["John", 1, "Jane", 2];
