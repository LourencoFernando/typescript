// Built-in generic type: `Array<string>` is the same as `string[]`. The type
// in angle brackets is a type argument that fills the type parameter.
let names: Array<string> = ["Anna", "Silva"];

// Generic type alias: `T` is a placeholder chosen by whoever uses the type.
// This is the DataStore index signature from advanced types, made reusable.
type DataStore<T> = {
    [key: string]: T;
};

// The same DataStore shape, with different value types.
let store: DataStore<string | boolean> = {};
store.name = "Test";
store.isInstructor = true;

let nameStore: DataStore<string> = {};

// Generic function: both arguments must share one type `T`, and the return
// type is inferred as `T[]`.
function merge<T>(a: T, b: T) {
    return [a, b];
}

// Explicit type argument. The commented line infers `T` as `number` from the
// arguments, with the same result. Either way, `merge(1, "a")` is an error
// because "a" is not a number.
const ids = merge<number>(1, 2);
// const ids = merge(1, 2);

// Several type parameters let the arguments have different types. The
// result is `(T | U)[]`, here `(string | number)[]`.
function mergeMultiple<T, U>(a: T, b: U) {
    return [a, b];
}
const multipleParams = mergeMultiple(1, "Test");

// Constraint: `extends object` only accepts object types, which makes the
// spread safe. `mergeObj(1, { age: 70 })` is an error. The return type is the
// intersection `T & U`, so `merged.userName` and `merged.age` are both typed.
function mergeObj<T extends object, U extends object>(a: T, b: U) {
    return { ...a, ...b };
}
const merged = mergeObj({ userName: "test1" }, { age: 70 });

// Generic class: `T` is inferred from the constructor argument, so this is
// `User<string>` and `user.id` is a `string`.
class User<T> {
    constructor(public id: T) {}
}

const user = new User("i1");
user.id;

/*
 * Use cases and architectural decisions
 *
 * - Generics keep the link between input and output types. `merge<T>` returns
 *   `T[]`; the same function typed with `any` would lose that information,
 *   and one typed with `unknown` would force callers to narrow the result.
 * - Generic types like DataStore<T> fit containers whose shape stays the same
 *   while the contents vary: caches, repositories, API response wrappers such
 *   as `ApiResponse<T> = { data: T; error?: string }`, or form state.
 * - Prefer inference over explicit type arguments; write `merge<number>(...)`
 *   only when inference picks the wrong type or there are no arguments to
 *   infer from (e.g. `new Map<string, number>()`).
 * - Add constraints (`extends object`) when the body relies on a capability
 *   of `T`, like spreading or reading a property. Without them, TypeScript
 *   rejects the operation or allows invalid calls.
 * - A generic class like User<T> lets an ID be `string` (UUID) in one
 *   service and `number` (database sequence) in another without duplicating
 *   the class.
 * - Type parameters are erased at runtime: code can't check what `T` is
 *   (`instanceof T` doesn't work). Pass a value or a validator function when
 *   runtime behavior depends on the type.
 */
