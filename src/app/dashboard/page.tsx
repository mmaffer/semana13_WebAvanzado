import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-page py-12 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="bg-gradient-to-r from-brand to-accent rounded-2xl p-8 text-white mb-8 shadow-lg shadow-brand-dark/20">
                    <div className="flex items-center gap-5">
                        {session?.user?.image ? (
                            <Image
                                height={72}
                                width={72}
                                src={session.user.image}
                                alt="Avatar"
                                className="w-18 h-18 rounded-full ring-4 ring-white/20"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-indigo-400/40 flex items-center justify-center text-2xl font-bold text-white ring-4 ring-white/20">
                                {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                            </div>
                        )}
                        <div>
                            <p className="text-indigo-200 text-sm font-medium">Bienvenido de vuelta</p>
                            <h1 className="text-3xl font-bold mt-0.5">{session?.user?.name}</h1>
                            <p className="text-indigo-200 text-sm mt-1">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1">Estado</p>
                        <p className="text-lg font-bold text-slate-800">Activo</p>
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Sesión iniciada
                        </span>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm font-semibold text-slate-800 break-all">{session?.user?.email}</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                        <p className="text-xs font-semibold text-text-faint uppercase tracking-wide mb-1">Rol</p>
                        <p className="text-lg font-bold text-slate-800">Usuario</p>
                        <span className="inline-block mt-2 text-xs bg-indigo-100 text-brand px-2 py-0.5 rounded-full font-medium">
                            Estándar
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
