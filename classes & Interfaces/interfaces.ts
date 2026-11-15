// Interfaces describe the shape of an object: its properties and methods,
// without any implementation.
interface Authenticatable {
    email: string;
    password: string;

    // Method signatures: implementers must provide these with matching types.
    login(): void;
    logout(): void;
}

// Declaration merging: a second `interface` with the same name adds members
// to the first. Authenticatable now requires email, password, role, login,
// and logout. (A `type` alias with a repeated name is an error instead.)
interface Authenticatable {
    role: string;
}

// `extends` builds a new interface on top of an existing one. A member can be
// redeclared with a narrower type: `role` must now be one of two literals,
// which is still assignable to the base `string`.
interface AuthenticatableAdmin extends Authenticatable {
    role: "admin" | "superadmin";
}

// `implements` makes the compiler check that the class satisfies the
// interface. The class may add extra members (`userName`) beyond the contract.
class AuthenticatableUser implements Authenticatable {
    constructor(
        public userName: string,
        public email: string,
        public password: string,
        public role: string
    ) {}

    login() {
        // Empty body: the example only shows that the method must exist.
    }

    logout() {
        // Empty body, as above.
    }
}

// Typing a parameter with the interface accepts any matching object: an
// AuthenticatableUser instance or a plain object literal both work.
function Authenticate(user: Authenticatable) {
    user.login();
}

// An interface can also type a variable. The object literal must provide
// every member from both merged declarations, and excess property checks
// reject members the interface doesn't declare.
let user: Authenticatable;

user = {
    email: "test@example.com",
    password: "abc1",
    role: "test",
    login() {
        // Empty body: only the shape is being checked.
    },
    logout() {
        // Empty body, as above.
    },
};

/*
 * Use cases and architectural decisions
 *
 * - An interface like Authenticatable defines a contract for an auth module:
 *   any user, admin, or service account object that matches the shape can be
 *   passed to code that logs users in, without sharing a base class.
 * - `implements` is optional: TypeScript is structurally typed, so a class
 *   that matches the shape is accepted anyway. Adding it moves errors to the
 *   class declaration instead of every call site, which helps when the
 *   contract is shared across a team.
 * - `extends` with a narrower `role` (AuthenticatableAdmin) models a
 *   specialized role at compile time, e.g. an admin dashboard that accepts
 *   only admin accounts. The check is static only; a role read from a token
 *   or database must still be verified at runtime.
 * - Declaration merging is how libraries let you augment their types (for
 *   example adding fields to an Express `Request`). Within your own code it
 *   can scatter a contract across files, so prefer a single declaration.
 * - Interfaces exist only at compile time and emit no JavaScript, so they
 *   can't be checked with `instanceof`. Validate data from APIs or forms at
 *   runtime separately.
 * - Interface vs. type alias: both can describe object shapes. Interfaces
 *   can be extended and merged across declarations, which suits public
 *   contracts; type aliases also cover unions and other non-object types.
 * - Storing a plain `password` on a long-lived object is fine for a learning
 *   example, but real applications keep only a hash or token after login.
 */
