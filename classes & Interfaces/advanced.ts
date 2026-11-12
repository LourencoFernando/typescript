// Advanced class features: getters, setters, protected, static,
// inheritance, and abstract classes.
// Each class name describes the feature it demonstrates.

// 1. Getter: `fullName` is read like a property but computed on each access.
class UserWithGetter {
    constructor(private firstName: string, private lastName: string) {}

    get fullName() {
        return this.firstName + " " + this.lastName;
    }
}

// 2. Setters with validation, `protected`, and `static`.
class UserWithAccessors {
    // `protected`: visible here and in subclasses, but not from outside.
    protected _firstName: string = "";
    // `private`: visible only inside this class, not in subclasses.
    private _lastName: string = "";

    // Setters validate before storing, so invalid names never reach the fields.
    set firstName(name: string) {
        if (name.trim() === "") {
            throw new Error("Invalid Name.");
        }
        this._firstName = name;
    }

    set lastName(name: string) {
        if (name.trim() === "") {
            throw new Error("Invalid Name.");
        }
        this._lastName = name;
    }

    get fullName() {
        // Read the backing fields: `firstName`/`lastName` have only setters,
        // so reading them returns undefined at runtime (tsc does not flag it).
        return this._firstName + " " + this._lastName;
    }

    // `static`: belongs to the class itself, accessed as UserWithAccessors.eid.
    static eid = "USER";
}

// 3. Inheritance: Employee gets all public and protected members of the base.
class Employee extends UserWithAccessors {
    constructor(public jobTitle: string) {
        // A subclass constructor must call super() before using `this`.
        super();
        // super.firstName = 'Any Name';
    }

    work() {
        // ...
        // Allowed: `_firstName` is protected. `_lastName` (private) is not.
        console.log(this._firstName);
    }
}

// 4. Abstract class: a base that can be extended but not instantiated.
abstract class UIElement {
    constructor(public identifier: string) {}

    clone(targetLocation: string) {
        // Logic to duplicate the UI element
    }
}

// Error: cannot create an instance of an abstract class.
// let UIElement = new UIElement(); // also errors: the variable reuses the class name
// const element = new UIElement("main-nav"); // only the abstract-class error

class SideDrawerElement extends UIElement {
    // `identifier` has no modifier here: the base class already declares it.
    constructor(identifier: string, public position: "left" | "right") {
        super(identifier);
    }
}

const getterUser = new UserWithGetter("Ana", "Silva");
console.log(getterUser.fullName); // no parentheses: getters read like properties

const employee = new Employee("Developer");
employee.firstName = "Bruno"; // runs the setter's validation
employee.lastName = "Costa";
console.log(employee.fullName);
console.log(UserWithAccessors.eid); // static: read from the class, not an instance
employee.work();

const drawer = new SideDrawerElement("side-drawer", "left");
console.log(drawer.identifier, drawer.position);

/*
 * Use cases and architectural decisions
 *
 * - Getters fit derived values (full name, totals, formatted labels) that
 *   should stay in sync with their sources without being stored separately.
 *   Keep them cheap: callers read them like fields and don't expect work.
 * - Setters with validation protect an invariant at the single write point,
 *   e.g. a form model that must never hold an empty name. Tradeoff: a plain
 *   assignment that can throw is surprising; a `rename(name)` method or a
 *   validated constructor makes the failure more explicit.
 * - A setter without a matching getter makes the property write-only: reads
 *   return undefined and tsc does not warn. Read the backing field instead.
 * - `protected` shares state with subclasses but couples them to the base
 *   class internals. Prefer `private` plus protected methods when the base
 *   class should control how its state changes.
 * - `static` suits constants and factories tied to the class (IDs, `fromJson`)
 *   rather than to one instance.
 * - Abstract classes fit UI component hierarchies or base repositories that
 *   share real code (`clone`). When only a contract is needed and there is no
 *   shared code, an interface is lighter and allows implementing several.
 * - Access modifiers and `abstract` are compile-time checks only; at runtime
 *   they are ordinary JavaScript classes and properties.
 */
