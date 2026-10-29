enum Role {
    Admin,
    Editor,
    Guest,
}

let userRole: Role = 0;
userRole = Role.Guest;

let userRoleLiteral: "admin" | "editor" | "guest" = "admin";
userRoleLiteral = "guest";

let possibleResults: [1 | -1, 1 | -1];
possibleResults = [1, -1];

type CustomRole = "admin" | "editor" | "guest" | "reader";
type User = {
    name: string;
    age: number;
    role: Role;
    permissions: string[];
};

let customUserRole: CustomRole = "admin";
