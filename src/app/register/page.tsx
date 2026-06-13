"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

        if (password !== confirm) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error);
            setLoading(false);
            return;
        }

        const result = await signIn("credentials", { email, password, redirect: false });
        if (result?.ok) {
            router.push("/dashboard");
            router.refresh();
        } else {
            router.push("/signIn");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Crear cuenta
                </h1>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name="name"
                        type="text"
                        placeholder="Nombre completo"
                        required
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Correo electrónico"
                        required
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Contraseña"
                        required
                        minLength={6}
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <input
                        name="confirm"
                        type="password"
                        placeholder="Confirmar contraseña"
                        required
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-black transition disabled:opacity-50"
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/signIn" className="text-gray-800 font-semibold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
