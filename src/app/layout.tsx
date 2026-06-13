import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Next Auth App",
    description: "My Next Auth App",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-page`}>
                <nav className="w-full bg-nav border-b border-nav-border">
                    <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                        <Link href="/" className="text-white font-bold text-lg tracking-tight">
                            MyAuthApp
                        </Link>

                        <ul className="flex items-center gap-1 text-sm">
                            <li>
                                <Link href="/dashboard" className="text-text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                                    Dashboard
                                </Link>
                            </li>

                            {session?.user ? (
                                <>
                                    <li>
                                        <Link href="/profile" className="text-text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                                            Perfil
                                        </Link>
                                    </li>
                                    <li>
                                        <LogoutButton />
                                    </li>
                                    <li className="ml-1">
                                        {session.user.image ? (
                                            <Image
                                                height={36}
                                                width={36}
                                                src={session.user.image}
                                                alt="Avatar"
                                                className="w-9 h-9 rounded-full ring-2 ring-nav-border"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-zinc-700">
                                                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                                            </div>
                                        )}
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href="/register" className="text-text-muted hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
                                            Registrarse
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/signIn" className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg transition font-medium">
                                            Iniciar sesión
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>

                <Provider>
                    <main>{children}</main>
                </Provider>
            </body>
        </html>
    );
}
