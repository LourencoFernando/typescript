// ECMAScript (standard) decorators: functions applied with `@name` to a
// class or class member. Each one receives the decorated value and a context
// object describing it (`kind`, `name`, `addInitializer`, ...), and may
// return a replacement. The context type says what a decorator can be used on.
//
// Run order (see the output): all decorators run once, when the class is
// defined, members first and then the class. Their returned replacements and
// initializers run later, each time an instance is created.
//
// Node can't run this file directly (no `@decorator` support yet); compile it
// first. See the folder README.

// Class decorator. `T extends new (...args: any[]) => any` accepts any class
// (a constructor function). Returning a subclass replaces Person with it, so
// every `new Person()` also runs the extra constructor code below.
function logger<T extends new (...args: any[]) => any>(
    target: T,
    ctx: ClassDecoratorContext
) {
    console.log("logger decorator");
    console.log(target);
    console.log(ctx);

    return class extends target {
        constructor(...args: any[]) {
            super(...args);
            console.log("class constructor");
            console.log(this);
        }
    };
}

// Method decorator.
function autobind(
    target: (...args: any[]) => any,
    ctx: ClassMethodDecoratorContext
) {
    // `addInitializer` runs for each new instance, so `this` is the instance.
    // Binding the method there keeps `this` correct even when the method is
    // detached, as in `const greet = instance.greet`.
    ctx.addInitializer(function (this: any) {
        this[ctx.name] = this[ctx.name].bind(this);
    });

    // The returned function replaces the method. It doesn't forward arguments
    // or the return value, which is fine for `greet` (none of either).
    return function (this: any) {
        console.log("Exec the original function");
        target.apply(this);
    };
}

// Field decorator. A field has no value at definition time, so `target` is
// always `undefined`. The returned function receives the field's initial
// value for each instance, and its result becomes the actual value. Returning
// "" here replaces "Any Name", which is why greet() prints "Hi, I am ".
function fieldLogger(target: undefined, ctx: ClassFieldDecoratorContext) {
    console.log(target);
    console.log(ctx);

    return (initialValue: any) => {
        console.log(initialValue);
        return "";
    };
}

// Decorator factory: a function that takes arguments and returns the actual
// decorator, used as `@replacer(...)` with parentheses. `initValue` isn't used
// yet; the decorator still returns "" like fieldLogger. Returning `initValue`
// would make the argument replace the field's value.
function replacer<T>(initValue: T) {
    return function replacerDecorator(
        target: undefined,
        ctx: ClassFieldDecoratorContext
    ) {
        console.log(target);
        console.log(ctx);

        return (initialValue: any) => {
            console.log(initialValue);
            return "";
        };
    };
}

@logger
class Person {
    @fieldLogger
    name = "Any Name";

    @replacer("")
    nameReplace = "Any Name";

    // Manual alternative to @autobind. With both in place the method is bound
    // twice, which is harmless (the output shows "bound bound").
    constructor() {
        this.greet = this.greet.bind(this);
    }

    @autobind
    greet() {
        console.log("Hi, I am " + this.name);
    }
}

const instance = new Person();
// Detached call: without binding, `this` would be undefined here.
const greet = instance.greet;
greet();

/*
 * Use cases and architectural decisions
 *
 * - Decorators move cross-cutting behavior out of the class body: logging or
 *   timing methods, binding event handlers (autobind for callbacks passed to
 *   DOM listeners), validating or transforming fields, or registering classes
 *   with a framework (routes, dependency injection, ORM entities).
 * - Standard decorators (TypeScript 5.0+) follow the ECMAScript proposal and
 *   need no compiler flag. Frameworks such as Angular, NestJS, and TypeORM
 *   still use the older `experimentalDecorators` version, which has different
 *   signatures and supports parameter decorators. The two can't be mixed in
 *   one project, so pick the version your framework expects.
 * - Replacing a class (logger) or method (autobind) changes runtime behavior
 *   invisibly at the call site, and a replacement that drops arguments or
 *   return values introduces subtle bugs. Keep decorators small and forward
 *   `...args` and the result when wrapping.
 * - For a single class, an arrow-function field (`greet = () => {...}`) or a
 *   bind in the constructor is simpler than a decorator. Decorators pay off
 *   when the same behavior repeats across many classes.
 * - Runtime support is still limited: Node and most browsers can't run the
 *   syntax natively, so the code must be compiled (by tsc or a bundler).
 */
