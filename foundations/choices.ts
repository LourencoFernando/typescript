// Numeric enums start at 0 by default.
enum Role {
    Admin,
    Editor,
    Guest,
}

let userRole: Role = 0;
userRole = Role.Guest;

// Literal unions restrict the allowed values.
let userRoleLiteral: "admin" | "editor" | "guest" = "admin";
userRoleLiteral = "guest";

// Each tuple position accepts only 1 or -1.
let possibleResults: [1 | -1, 1 | -1];
possibleResults = [1, -1];

// Type aliases name reusable types.
type CustomRole = "admin" | "editor" | "guest" | "reader";

type User = {
    name: string;
    age: number;
    role: Role;
    permissions: string[];
};

let customUserRole: CustomRole = "admin";
