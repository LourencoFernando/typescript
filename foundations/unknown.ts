// unknown requires type checks before accessing properties or calling methods.
function process(val: unknown) {
    if (
        typeof val === "object" &&
        val !== null &&
        "log" in val &&
        typeof val.log === "function"
    ) {
        val.log();
    }
}
