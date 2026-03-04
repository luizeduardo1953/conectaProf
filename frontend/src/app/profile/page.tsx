'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import {
    User as UserIcon,
    Mail,
    Settings,
    LogOut,
    Camera,
    ArrowLeft,
    Shield,
    Bell,
    ChevronRight,
    Calendar,
    Clock,
    Plus,
    Trash2
} from 'lucide-react';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [dbUser, setDbUser] = useState<any>(null); // To store PostgreSQL user data (including role)
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'personal' | 'schedule'>('personal');
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [newAvail, setNewAvail] = useState({ dayWeek: 1, timeStart: '08:00', timeEnd: '12:00' });
    const [savingSchedule, setSavingSchedule] = useState(false);

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch the backend user to get the role
                try {
                    const response = await fetch(`http://localhost:8000/users/email/${currentUser.email}`);
                    if (response.ok) {
                        const text = await response.text();
                        if (text) {
                            const data = JSON.parse(text);
                            setDbUser(data);

                            if (data.role === 'teacher') {
                                try {
                                    const teacherRes = await fetch(`http://localhost:8000/teachers/${data.id}`);
                                    if (teacherRes.ok) {
                                        const teacherText = await teacherRes.text();
                                        if (teacherText) {
                                            const teacherData = JSON.parse(teacherText);
                                            if (teacherData && teacherData.availabilities) {
                                                setAvailabilities(teacherData.availabilities);
                                            }
                                        }
                                    }
                                } catch (e) { console.error('Error fetching teacher data:', e); }
                            }
                        }
                    } else {
                        console.error('Failed to fetch user data from backend');
                    }
                } catch (error) {
                    console.error('Error fetching backend user:', error);
                }
            } else {
                // Not logged in, redirect to login
                router.push('/login');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleAddAvailability = async () => {
        if (!dbUser || dbUser.role !== 'teacher') return;
        setSavingSchedule(true);
        try {
            const response = await fetch(`http://localhost:8000/teachers/${dbUser.id}/availability`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAvail),
            });
            if (response.ok) {
                const added = await response.json();
                setAvailabilities([...availabilities, added]);
            } else {
                console.error('Failed to add availability', await response.text());
                alert('Erro ao salvar horário. Preencha seus Dados Pessoais de Professor primeiro caso seja seu primeiro acesso.');
            }
        } catch (error) {
            console.error('Error saving availability', error);
        } finally {
            setSavingSchedule(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-100/50 blur-[100px]"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-50/50 blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center text-slate-500 hover:text-rose-500 transition-colors font-medium bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Voltar ao Início
                    </button>

                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-xl font-bold text-slate-900">ConectaProf</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: User Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="relative inline-block mb-4 group">
                                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md mx-auto flex items-center justify-center overflow-hidden relative">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={40} className="text-slate-300" />
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors">
                                    <Camera size={14} />
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-1">
                                {user?.displayName || 'Usuário ConectaProf'}
                            </h2>
                            <p className="text-sm text-slate-500 mb-6 flex items-center justify-center gap-1">
                                <Mail size={14} />
                                {user?.email}
                            </p>

                            <div className="flex justify-center gap-2">
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${dbUser?.role === 'teacher' ? 'bg-green-50 text-green-600 border-green-100' :
                                    (dbUser?.role === 'student' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-100')
                                    }`}>
                                    {dbUser?.role === 'teacher' ? 'Professor(a)' : (dbUser?.role === 'student' ? 'Estudante' : 'Carregando...')}
                                </span>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configurações</h3>
                            </div>
                            <nav className="flex flex-col">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === 'personal' ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserIcon size={18} />
                                        <span className="font-medium text-sm">Dados Pessoais</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>

                                {dbUser?.role === 'teacher' && (
                                    <button
                                        onClick={() => setActiveTab('schedule')}
                                        className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === 'schedule' ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar size={18} />
                                            <span className="font-medium text-sm">Configurar Agenda</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                                <button className="flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 text-left transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} />
                                        <span className="font-medium text-sm">Segurança e Senha</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 text-left transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Bell size={18} />
                                        <span className="font-medium text-sm">Notificações</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>
                                <button className="flex items-center justify-between p-4 text-slate-600 hover:bg-slate-50 text-left transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Settings size={18} />
                                        <span className="font-medium text-sm">Preferências</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Right Column: Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Personal Data Form */}
                        {activeTab === 'personal' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Dados Pessoais</h2>
                                    <p className="text-sm text-slate-500 mt-1">Atualize as informações do seu perfil público e dados de contato.</p>
                                </div>

                                <form className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Nome de exibição</label>
                                            <input
                                                type="text"
                                                defaultValue={user?.displayName || ''}
                                                placeholder="Seu nome completo"
                                                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-slate-700">Telefone</label>
                                            <input
                                                type="tel"
                                                placeholder="(00) 00000-0000"
                                                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">E-mail</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <Mail className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="email"
                                                disabled
                                                value={user?.email || ''}
                                                className="w-full rounded-xl bg-gray-100 border border-gray-200 p-3 pl-10 text-slate-500 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">O e-mail não pode ser alterado por aqui. Entre em contato com o suporte.</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Biografia Profissional</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Conte um pouco sobre sua experiência como professor..."
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            className="rounded-xl bg-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 hover:shadow-rose-500/40 active:scale-[0.98]"
                                        >
                                            Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'schedule' && dbUser?.role === 'teacher' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Configuração de Agenda</h2>
                                    <p className="text-sm text-slate-500 mt-1">Defina seus horários de disponibilidade para os alunos agendarem aulas.</p>
                                </div>
                                <div className="space-y-6 flex flex-col">
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                            <Clock size={16} className="text-rose-500" /> Adicionar Novo Horário
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            <div className="sm:col-span-1">
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Dia da Semana</label>
                                                <select
                                                    value={newAvail.dayWeek}
                                                    onChange={e => setNewAvail({ ...newAvail, dayWeek: Number(e.target.value) })}
                                                    className="w-full rounded-lg bg-white border border-gray-200 p-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                                >
                                                    {daysOfWeek.map((day, idx) => (
                                                        <option key={idx} value={idx}>{day}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Início</label>
                                                <input
                                                    type="time"
                                                    value={newAvail.timeStart}
                                                    onChange={e => setNewAvail({ ...newAvail, timeStart: e.target.value })}
                                                    className="w-full rounded-lg bg-white border border-gray-200 p-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                                />
                                            </div>
                                            <div className="sm:col-span-1">
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Fim</label>
                                                <input
                                                    type="time"
                                                    value={newAvail.timeEnd}
                                                    onChange={e => setNewAvail({ ...newAvail, timeEnd: e.target.value })}
                                                    className="w-full rounded-lg bg-white border border-gray-200 p-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                                />
                                            </div>
                                            <div className="sm:col-span-1 flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddAvailability}
                                                    disabled={savingSchedule}
                                                    className="w-full rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 p-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                                >
                                                    <Plus size={16} /> {savingSchedule ? 'Salvando...' : 'Adicionar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-3">Horários Cadastrados</h3>
                                        {availabilities.length === 0 ? (
                                            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                                                <Calendar className="text-gray-300 mb-3" size={32} />
                                                <p className="text-sm text-slate-500">Você ainda não tem horários disponíveis configurados.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availabilities.map((avail, idx) => (
                                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold">
                                                                {daysOfWeek[avail.dayWeek]?.substring(0, 3)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-700">{daysOfWeek[avail.dayWeek]}</div>
                                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <Clock size={12} />
                                                                    {new Date(avail.timeStart).toISOString().substr(11, 5)} - {new Date(avail.timeEnd).toISOString().substr(11, 5)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Danger Zone */}
                        <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-bold text-red-900">Encerrar Sessão</h3>
                                <p className="text-sm text-red-700/80 mt-1">Sair da sua conta neste dispositivo.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white border border-red-200 px-5 py-2.5 text-red-600 font-bold hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                                <LogOut size={18} /> Sair da conta
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
