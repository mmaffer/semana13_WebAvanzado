"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";

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

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError(
                result.error === "CredentialsSignin"
                    ? "Credenciales inválidas"
                    : result.error
            );
            return;
        }

        if (result?.ok) {
            router.push("/dashboard");
            router.refresh();
        }
    };

    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleGithubSignIn = async () => {
        await signIn("github", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl text-gray-800 font-bold mb-6 text-center">
                    Iniciar sesión
                </h1>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-4 mb-4">
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
                        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-black transition disabled:opacity-50"
                    >
                        {loading ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>

                <div className="flex items-center gap-2 mb-4">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-xs text-gray-400">o continúa con</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <FaGoogle />
                        Continuar con Google
                    </button>
                    <button
                        onClick={handleGithubSignIn}
                        className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
                    >
                        <FaGithub />
                        Continuar con GitHub
                    </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-gray-800 font-semibold hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
}
