import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/users";
import { isBlocked, recordFailedAttempt, resetAttempts } from "@/lib/loginAttempts";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                if (isBlocked(credentials.email)) {
                    throw new Error("Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta en 15 minutos.");
                }

                const user = getUserByEmail(credentials.email);
                if (!user) {
                    recordFailedAttempt(credentials.email);
                    return null;
                }

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) {
                    const attempts = recordFailedAttempt(credentials.email);
                    const remaining = 5 - attempts;
                    if (remaining > 0) {
                        throw new Error(`Contraseña incorrecta. ${remaining} intento(s) restante(s).`);
                    }
                    throw new Error("Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta en 15 minutos.");
                }

                resetAttempts(credentials.email);
                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/signIn",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.picture = (user as any).image ?? token.picture ?? null;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.name ?? session.user.name;
                session.user.email = (token.email ?? session.user.email) as string;
                session.user.image = (token.picture as string | null) ?? null;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
