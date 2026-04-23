'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Clock, Trash2, AlertCircle, X } from 'lucide-react';

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <div
                className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full">
                        <AlertCircle className="text-red-500" size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Cancelar Aula</h3>
                </div>
                <p className="text-slate-600 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-slate-600 font-semibold hover:bg-gray-50 transition"
                    >
                        Não, manter
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition"
                    >
                        Sim, cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ClassesPage() {
    const router = useRouter();
    const [dbUser, setDbUser] = useState<any>(null);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const url = process.env.NEXT_PUBLIC_URL_BACKEND;

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 4000);
    };

    useEffect(() => {
        const fetchClasses = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                const userRes = await fetch(`${url}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!userRes.ok) throw new Error('Not auth');
                const userData = await userRes.json();
                setDbUser(userData);

                const endpoint = userData.role === 'teacher' ? '/scheduling/my-classes' : '/scheduling/my-scheduling';
                const classRes = await fetch(`${url}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (classRes.ok) {
                    setClasses(await classRes.json());
                }
            } catch {
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [router, url]);

    const handleConfirmCancel = async () => {
        if (!cancelTarget) return;
        const id = cancelTarget;
        setCancelTarget(null);
        setCancellingId(id);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${url}/scheduling/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setClasses(prev => prev.filter(c => c.id !== id));
                showSuccess('Aula cancelada com sucesso.');
            } else {
                showError('Erro ao cancelar a aula. Tente novamente.');
            }
        } catch {
            showError('Erro de conexão.');
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const upcoming = classes.filter(c => new Date(c.dateHourStart) >= new Date());
    const past = classes.filter(c => new Date(c.dateHourStart) < new Date());

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center text-slate-500 hover:text-rose-500 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm font-medium"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Voltar ao Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="text-rose-500" /> Minhas Aulas
                    </h1>
                </div>

                {/* Feedback */}
                {successMsg && (
                    <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4">
                        <AlertCircle size={18} />
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                )}

                {classes.length === 0 ? (
                    <div className="text-center p-16 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhuma aula agendada</h3>
                        <p className="text-slate-500">
                            {dbUser?.role === 'student'
                                ? 'Você ainda não agendou nenhuma aula.'
                                : 'Você ainda não tem aulas confirmadas com alunos.'}
                        </p>
                        {dbUser?.role === 'student' && (
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="mt-6 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl shadow hover:bg-rose-600 transition"
                            >
                                Encontrar um Professor
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Upcoming */}
                        {upcoming.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                                    Próximas ({upcoming.length})
                                </h2>
                                <div className="space-y-4">
                                    {upcoming.map((cls: any) => {
                                        const startDate = new Date(cls.dateHourStart);
                                        const endDate = new Date(cls.dateHourEnd);
                                        const otherPerson = dbUser?.role === 'teacher' ? cls.student : cls.teacher?.user;
                                        const isCancelling = cancellingId === cls.id;

                                        return (
                                            <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                                                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-rose-50 rounded-xl px-5 py-4 min-w-[90px]">
                                                    <span className="text-2xl font-bold text-rose-600">{startDate.getDate()}</span>
                                                    <span className="text-xs font-bold text-rose-400 uppercase">
                                                        {startDate.toLocaleDateString('pt-BR', { month: 'short' })}
                                                    </span>
                                                </div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-600">Agendada</span>
                                                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-bold rounded-md">
                                                            {cls.discipline?.name || 'Aula Particular'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={15} className="text-slate-400" />
                                                        <span className="font-bold text-slate-800">{otherPerson?.name || 'Usuário'}</span>
                                                        <span className="text-xs text-slate-500">({dbUser?.role === 'teacher' ? 'Aluno' : 'Professor'})</span>
                                                    </div>

                                                    <p className="text-slate-600 flex items-center gap-2 text-sm">
                                                        <Clock size={14} className="text-slate-400" />
                                                        {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — {endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>

                                                    {cls.observation && (
                                                        <div className="mt-3 bg-slate-50 p-3 rounded-xl text-sm text-slate-600 border border-slate-100">
                                                            <span className="font-semibold block mb-1">Observação:</span>
                                                            {cls.observation}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex md:flex-col justify-end items-end gap-2">
                                                    <button
                                                        onClick={() => setCancelTarget(cls.id)}
                                                        disabled={isCancelling}
                                                        className="flex items-center gap-1.5 text-red-500 font-bold bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition text-sm disabled:opacity-50"
                                                    >
                                                        <Trash2 size={15} />
                                                        {isCancelling ? 'Cancelando...' : 'Cancelar'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Past */}
                        {past.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                                    Histórico ({past.length})
                                </h2>
                                <div className="space-y-4 opacity-70">
                                    {past.map((cls: any) => {
                                        const startDate = new Date(cls.dateHourStart);
                                        const endDate = new Date(cls.dateHourEnd);
                                        const otherPerson = dbUser?.role === 'teacher' ? cls.student : cls.teacher?.user;

                                        return (
                                            <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                                                <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-xl px-5 py-4 min-w-[90px]">
                                                    <span className="text-2xl font-bold text-slate-500">{startDate.getDate()}</span>
                                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                                        {startDate.toLocaleDateString('pt-BR', { month: 'short' })}
                                                    </span>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-gray-100 text-gray-500">Concluída</span>
                                                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 text-xs font-bold rounded-md">
                                                            {cls.discipline?.name || 'Aula Particular'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User size={15} className="text-slate-400" />
                                                        <span className="font-bold text-slate-700">{otherPerson?.name || 'Usuário'}</span>
                                                    </div>
                                                    <p className="text-slate-500 flex items-center gap-2 text-sm">
                                                        <Clock size={14} />
                                                        {startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} — {endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirm Cancel Modal */}
            {cancelTarget && (
                <ConfirmModal
                    message="Tem certeza que deseja cancelar esta aula? Esta ação não pode ser desfeita."
                    onConfirm={handleConfirmCancel}
                    onCancel={() => setCancelTarget(null)}
                />
            )}
        </div>
    );
}
