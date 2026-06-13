import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Next Auth App",
    description: "My Next Auth App",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <nav className="w-full bg-black shadow-sm text-white">
                    <div className="mx-auto px-6 py-4 flex items-center justify-between">
                        <Link href="/" className="text-xl font-semibold text-white">
                            MyAuthApp
                        </Link>
                        <ul className="flex items-center justify-center gap-6 text-sm">
                            <li>
                                <Link href="/dashboard" className="text-white hover:text-gray-400">
                                    Dashboard
                                </Link>
                            </li>
                            {session?.user && (
                                <li>
                                    <Link href="/profile" className="text-white hover:text-gray-400">
                                        Profile
                                    </Link>
                                </li>
                            )}
                            {!session?.user && (
                                <li>
                                    <Link href="/register" className="text-white hover:text-gray-400">
                                        Registrarse
                                    </Link>
                                </li>
                            )}
                            {!session?.user && (
                                <li>
                                    <Link href="/signIn" className="text-white hover:text-gray-400">
                                        Iniciar sesión
                                    </Link>
                                </li>
                            )}
                            {session?.user && (
                                <li>
                                    <LogoutButton />
                                </li>
                            )}
                            {session?.user && (
                                <li>
                                    {session.user.image ? (
                                        <Image
                                            height={40}
                                            width={40}
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                    )}
                                </li>
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
