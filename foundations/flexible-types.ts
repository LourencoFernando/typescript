// any opts out of type checking for this value.
let age: any = 36;
// A union limits the allowed values to the listed types.
let ageUnion: number | string = 36;

// These assignments are all allowed because age is any.
age = "Thirty-six";
age = true;
age = {};
age = [];

// Both assignments match the union; a boolean would cause a type error.
ageUnion = "36";
ageUnion = 36;

// Type annotations are checked at compile time, not enforced at runtime.
