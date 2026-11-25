// autobind decorator
// Legacy method decorator (`experimentalDecorators`): it receives the
// prototype, the method name, and its descriptor. The unused first two
// parameters are named `_` and `_2` to satisfy `noUnusedParameters`.
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    // Replace the method with a getter that binds it to the instance on
    // access, so `addEventListener` keeps the correct `this`.
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

/*
 * Use cases and architectural decisions
 *
 * - As a module, the decorator is imported where it is used, and a decorator
 *   runs when the class is defined. ES modules evaluate dependencies first, so
 *   this file always runs before the components that apply `@autobind`. The
 *   namespace version needed its `<script>` tag placed before theirs.
 *
 * - `project-input.ts` imports it as `{ autobind as Autobind }`. Renaming an
 *   import avoids a name clash or matches a local convention, but the exported
 *   name stays `autobind`, so searching the codebase needs both names.
 *
 * - Arrow-function class fields (`handler = () => {}`) bind `this` without a
 *   decorator or `experimentalDecorators`. Standard ECMAScript decorators use a
 *   different signature, so this one would need rewriting if the flag were
 *   turned off.
 */
