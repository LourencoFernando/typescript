type StringArray = string[];

let text = 1;

// Conditional type: `T extends X ? A : B` picks a type based on a check,
// like a ternary for types. For arrays, `T[number]` is the element type.
type GetElementType<T> = T extends any[] ? T[number] : never;
// string, because string[] is an array.
type Example1 = GetElementType<StringArray>;
// never, because `typeof text` is number, not an array.
type Example2 = GetElementType<typeof text>;

type FullnamePerson = { firstName: string; lastName: string };
// `string` for objects with both name fields, `never` otherwise.
type FullnameOrNothing<T> = T extends FullnamePerson ? string : never;

// The return type depends on the argument type. TypeScript can't prove that
// the body matches a conditional return type, so the `as` assertion is needed.
function getFullname<T extends object>(person: T): FullnameOrNothing<T> {
    // The `in` checks narrow `person` so the properties can be read.
    if (
        "firstName" in person &&
        "lastName" in person &&
        person.firstName &&
        person.lastName
    ) {
        return `${person.firstName} ${person.lastName}` as FullnameOrNothing<T>;
    }

    throw new Error("No first name and / or last name found.");
}

// Typed `never`: `{}` has no name fields. It also throws at runtime, which
// matches `never` ("this call never returns a value").
const name1 = getFullname({});
// Typed `string`.
const name2 = getFullname({ firstName: "TestFirst", lastName: "TestLast" });

/*
 * Use cases and architectural decisions
 *
 * - Conditional types power type-level helpers that react to their input:
 *   unwrapping arrays or promises, built-ins such as `NonNullable<T>`,
 *   `Exclude<T, U>`, and `Extract<T, U>`, or API clients whose return type
 *   depends on a request option.
 * - A conditional return type makes the call site precise (name1 vs. name2),
 *   but the implementation needs assertions the compiler can't verify. Keep
 *   such functions small, or use overloads (see advanced types) when there
 *   are only a few cases.
 * - When `T` is a union, conditional types distribute over each member:
 *   `GetElementType<string[] | number>` is `string`. Wrap both sides in
 *   brackets (`[T] extends [any[]]`) to disable that.
 * - Returning `never` documents an impossible result, but the runtime still
 *   needs a real check or a throw, as getFullname does.
 */
