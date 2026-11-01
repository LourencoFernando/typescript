// Node imports need @types/node for checking and Node.js at runtime.
import * as fs from "node:fs";
// strict checks that the variable is assigned before it is read.
let userName;
userName = "Melody";
console.log(userName);
// Explicit any remains allowed with strict; callers lose operand type checks.
function add(a, b) {
    return a + b;
}
/*
Use cases and architectural decisions
- Node imports suit server scripts; installing types does not supply the runtime.
- strict catches unassigned reads, but explicit any bypasses operand checks:
  add can concatenate strings as well as add numbers.
- Keep the unused import and function to try noUnusedLocals in tsconfig.json.
*/
//# sourceMappingURL=app.js.map