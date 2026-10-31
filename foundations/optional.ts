// Optional parameters can be omitted by callers.
function generateError(msg?: string) {
    throw new Error(msg);
}

generateError();

// Optional properties do not need to be present on an object.
type UserOptional = {
    name: string;
    age: number;
    role?: "admin" | "guest";
};

// ?? uses the fallback only for null or undefined, preserving empty strings.
let input = "";
const didProvideInput = input ?? false;
