"use client";

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/signIn' })}
            className="text-text-muted hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm font-medium"
        >
            Cerrar sesión
        </button>
    );
}
