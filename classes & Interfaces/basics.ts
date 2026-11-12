// Class basics: three ways to declare the same User data.
// Each class name describes the feature it demonstrates.
// Note: properties use the primitive types `string`/`number`, not the
// wrapper object types `String`/`Number`, which TypeScript discourages.

// 1. Fields declared explicitly, then assigned in the constructor.
class UserWithExplicitFields {
    name: string;
    age: number;

    constructor(n: string, a: number) {
        this.name = n;
        this.age = a;
    }
}

// 2. Parameter properties: an access modifier on a constructor parameter
// (here `public`) declares and assigns the field in one step.
class UserWithParameterProperties {
    constructor(public name: string, public age: number) {}
}

// 3. Access modifiers and readonly:
// - `readonly hobbies`: the reference can't be reassigned, but the array
//   itself can still be mutated (push works).
// - `private readonly age`: only code inside the class can read it, and
//   nobody can reassign it after construction.
class UserWithModifiers {
    readonly hobbies: string[] = [];

    constructor(public name: string, private readonly age: number) {}

    greet() {
        // Private members are accessible from inside the class.
        console.log("My Age: " + this.age);
    }
}

const explicitUser = new UserWithExplicitFields("Ana", 30);
const shorthandUser = new UserWithParameterProperties("Bruno", 25);
const modifiersUser = new UserWithModifiers("Carla", 28);

explicitUser.age = 31; // public field: can be reassigned
console.log(shorthandUser.name);

modifiersUser.hobbies.push("Reading"); // OK: mutates the readonly array
modifiersUser.greet();

// Uncomment to see the compile-time errors:
// modifiersUser.hobbies = []; // Error: hobbies is read-only
// console.log(modifiersUser.age); // Error: age is private

/*
 * Use cases and architectural decisions
 *
 * - Explicit fields suit classes whose constructor transforms or validates
 *   input before storing it (e.g. normalizing an email), because the field
 *   and its assignment logic stay visible and separate.
 * - Parameter properties remove boilerplate for plain data holders and
 *   dependency-injected services (`constructor(private repo: UserRepo)`).
 *   Tradeoff: the class shape is hidden in the constructor signature, and
 *   they are TypeScript-only syntax, so Node's type stripping rejects them
 *   unless run with `--experimental-transform-types` (or compiled by tsc).
 * - `private` and `readonly` are compile-time checks only; at runtime the
 *   value is still an ordinary, writable property. Use JavaScript `#private`
 *   fields or `Object.freeze` when real runtime protection matters.
 * - `readonly` on an array protects the reference, not the contents. Use
 *   `readonly string[]` (or `ReadonlyArray<string>`) to also block `push`.
 */
