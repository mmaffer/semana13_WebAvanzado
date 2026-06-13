"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub, FaLock } from "react-icons/fa";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = e.currentTarget;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        const result = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);

        if (result?.error) {
            setError(result.error === "CredentialsSignin" ? "Credenciales inválidas" : result.error);
            return;
        }
        if (result?.ok) {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-auth-from via-auth-via to-auth-to px-4">
            <div className="w-full max-w-sm">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-dark/40">
                        <FaLock className="text-white text-xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Bienvenido de nuevo</h1>
                    <p className="text-text-muted mt-1 text-sm">Inicia sesión en tu cuenta</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                    {error && (
                        <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mb-5">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2.5 shadow-sm"
                        >
                            <FaGoogle className="text-red-500" />
                            Continuar con Google
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                            className="w-full bg-nav hover:bg-nav-border text-white py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2.5 border border-nav-border"
                        >
                            <FaGithub />
                            Continuar con GitHub
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <hr className="flex-1 border-white/10" />
                        <span className="text-xs text-text-faint font-medium">o con email</span>
                        <hr className="flex-1 border-white/10" />
                    </div>

                    <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-3">
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
                            placeholder="Contraseña"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand hover:bg-brand-hover text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50 shadow-lg shadow-brand-dark/30 mt-1"
                        >
                            {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-sm text-center text-text-faint">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-brand-hover font-semibold hover:text-white transition">
                        Regístrate gratis
                    </Link>
                </p>
            </div>
        </div>
    );
}
