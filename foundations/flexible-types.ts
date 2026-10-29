// any opts out of type checking for this value.
let age: any = 36;
let ageUnion: number | string = 36;

age = "Thirty-six";
age = true;
age = {};
age = [];

ageUnion = "36";
ageUnion = 36;

// Type annotations are checked at compile time, not enforced at runtime.
