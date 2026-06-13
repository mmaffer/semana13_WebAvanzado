import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="min-h-screen bg-page py-12 px-4">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-2xl font-bold text-slate-800 mb-6">Mi Perfil</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-brand to-accent h-28" />

                    <div className="px-8 pb-8">
                        <div className="-mt-12 mb-6">
                            {session?.user?.image ? (
                                <Image
                                    height={96}
                                    width={96}
                                    src={session.user.image}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded-full ring-4 ring-white shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white ring-4 ring-white shadow-md">
                                    {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 mb-1">{session?.user?.name}</h2>
                        <p className="text-text-muted text-sm mb-6">{session?.user?.email}</p>

                        <div className="border-t border-slate-100 pt-6 flex flex-col gap-1">
                            <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                <span className="text-xs font-semibold text-text-faint uppercase tracking-wide">Nombre</span>
                                <span className="text-sm font-medium text-slate-700">{session?.user?.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                <span className="text-xs font-semibold text-text-faint uppercase tracking-wide">Email</span>
                                <span className="text-sm font-medium text-slate-700">{session?.user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-xs font-semibold text-text-faint uppercase tracking-wide">Estado</span>
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                    Activo
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
