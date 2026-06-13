import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/users";

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    if (getUserByEmail(email)) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    createUser({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Usuario creado exitosamente" }, { status: 201 });
}
