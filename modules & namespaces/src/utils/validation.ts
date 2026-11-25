// Validation
// `project-input.ts` imports this module as `import * as Validation`, so both
// exports are used there as `Validation.Validatable` and `Validation.validate`.

// Optional properties let each input enable only the rules it needs.
export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    // `!= null` excludes both undefined and null, so a limit of 0 still
    // applies. `typeof` narrows the union so `.length` or `>=` type-checks.
    if (
        validatableInput.minLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (
        validatableInput.maxLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (
        validatableInput.min != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if (
        validatableInput.max != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }
    return isValid;
}

/*
 * Use cases and architectural decisions
 *
 * - A `utils/` module holds pure functions with no DOM or state access, so it
 *   can be reused by any component and tested without a browser.
 *
 * - Exporting the type next to the function lets callers pick an import style:
 *   named imports (`{ validate }`) for a few names, or a namespace import
 *   (`* as Validation`) to group a module's exports under one prefix. The
 *   namespace import reads clearly at the call site, but bundlers can drop
 *   unused exports less reliably when the whole object is passed around.
 *
 * - This only checks the form in the browser. A real app validates again on
 *   the server, often with a schema library that infers the TypeScript type
 *   from the rules instead of keeping a separate interface in sync.
 */
