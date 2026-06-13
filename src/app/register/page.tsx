"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-from via-auth-via to-auth-to px-4">
            <div className="w-full max-w-sm">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-dark/40">
                        <FaUserPlus className="text-white text-xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Crea tu cuenta</h1>
                    <p className="text-text-muted mt-1 text-sm">Empieza gratis hoy</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                    {error && (
                        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            name="name"
                            type="text"
                            placeholder="Nombre completo"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Contraseña (mín. 6 caracteres)"
                            required
                            minLength={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                        />
                        <input
                            name="confirm"
                            type="password"
                            placeholder="Confirmar contraseña"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 shadow-lg shadow-brand-dark/30 mt-1"
                        >
                            {loading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-sm text-center text-text-faint">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/signIn" className="text-brand-hover font-semibold hover:text-white transition">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
