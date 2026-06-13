import fs from "fs";
import path from "path";

interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, "[]");
}

export function getUsers(): User[] {
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export function getUserByEmail(email: string): User | undefined {
    return getUsers().find((u) => u.email === email);
}

export function createUser(user: Omit<User, "id">): User {
    const users = getUsers();
    const newUser: User = { ...user, id: crypto.randomUUID() };
    users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
    return newUser;
}
