// Interfaces describe the shape of an object: its properties and methods,
// without any implementation.
interface Authenticatable {
    email: string;
    password: string;

    // Method signatures: implementers must provide these with matching types.
    login(): void;
    logout(): void;
}

/*
 * Use cases and architectural decisions
 *
 * - An interface like Authenticatable defines a contract for an auth module:
 *   any user, admin, or service account object that matches the shape can be
 *   passed to code that logs users in, without sharing a base class.
 * - Interfaces exist only at compile time and emit no JavaScript, so they
 *   can't be checked with `instanceof`. Validate data from APIs or forms at
 *   runtime separately.
 * - Interface vs. type alias: both can describe object shapes. Interfaces
 *   can be extended and merged across declarations, which suits public
 *   contracts; type aliases also cover unions and other non-object types.
 * - Storing a plain `password` on a long-lived object is fine for a learning
 *   example, but real applications keep only a hash or token after login.
 */
