// any opts out of type checking for this value.
let age: any = 36;

// A union allows only its listed types.
let ageUnion: number | string = 36;

age = "Thirty-six";
age = true;
age = {};
age = [];

ageUnion = "36";
ageUnion = 36;
