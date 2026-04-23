'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User as UserIcon,
    Mail,
    LogOut,
    ArrowLeft,
    Calendar,
    Clock,
    Plus,
    Trash2,
    Save,
    CheckCircle2,
    AlertCircle,
    DollarSign,
    GraduationCap,
    Phone,
    ChevronRight,
} from 'lucide-react';

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [teacherProfile, setTeacherProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'personal' | 'teacher' | 'schedule'>('personal');
    const [availabilities, setAvailabilities] = useState<any[]>([]);
    const [newAvail, setNewAvail] = useState({ dayWeek: 1, timeStart: '08:00', timeEnd: '12:00' });

    // Form states
    const [userName, setUserName] = useState('');
    const [biography, setBiography] = useState('');
    const [priceHour, setPriceHour] = useState('');
    const [training, setTraining] = useState('');
    const [telephone, setTelephone] = useState('');
    const [location, setLocation] = useState('');

    // Feedback states
    const [savingPersonal, setSavingPersonal] = useState(false);
    const [savingTeacher, setSavingTeacher] = useState(false);
    const [savingSchedule, setSavingSchedule] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const url = process.env.NEXT_PUBLIC_URL_BACKEND;
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setErrorMsg('');
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const showError = (msg: string) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 4000);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                const res = await fetch(`${url}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    router.push('/signin');
                    return;
                }

                const data = await res.json();
                setUser(data);
                setUserName(data.name || '');

                // Se for professor, buscar perfil de professor
                if (data.role === 'teacher') {
                    try {
                        const tRes = await fetch(`${url}/teachers`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (tRes.ok) {
                            const allTeachers = await tRes.json();
                            const tData = allTeachers.find((t: any) => t.userId === data.id);
                            
                            if (tData) {
                                setTeacherProfile(tData);
                                setBiography(tData.biography || '');
                                setPriceHour(String(tData.priceHour || ''));
                                setTraining(tData.training || '');
                                setTelephone(tData.telephone || '');
                                setLocation(tData.location || '');
                                setAvailabilities(tData.availabilities || []);
                            }
                        }
                    } catch {
                        // Erro silencioso
                    }
                }
            } catch {
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router, url]);

    const handleSavePersonal = async () => {
        const token = localStorage.getItem('token');
        setSavingPersonal(true);
        try {
            const res = await fetch(`${url}/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: userName }),
            });
            if (res.ok) {
                setUser((prev: any) => ({ ...prev, name: userName }));
                showSuccess('Dados pessoais salvos com sucesso!');
            } else {
                showError('Erro ao salvar dados pessoais.');
            }
        } catch {
            showError('Erro de conexão.');
        } finally {
            setSavingPersonal(false);
        }
    };

    const handleSaveTeacherProfile = async () => {
        const token = localStorage.getItem('token');
        setSavingTeacher(true);
        try {
            const payload: any = { userId: user.id };
            if (biography.trim()) payload.biography = biography.trim();
            if (training.trim()) payload.training = training.trim();
            if (telephone.trim()) payload.telephone = telephone.trim();
            if (location.trim()) payload.location = location.trim();
            
            const parsedPrice = parseFloat(priceHour.replace(',', '.'));
            if (!isNaN(parsedPrice) && parsedPrice > 0) {
                payload.priceHour = parsedPrice;
            }

            const isUpdate = !!teacherProfile;
            const res = await fetch(
                isUpdate ? `${url}/teachers/${teacherProfile.id}` : `${url}/teachers`,
                {
                    method: isUpdate ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                const data = await res.json();
                setTeacherProfile(data);
                showSuccess('Perfil de professor atualizado!');
            } else {
                const err = await res.json().catch(() => ({}));
                const errMsg = Array.isArray(err?.message) ? err.message[0] : err?.message;
                showError(errMsg || 'Erro ao salvar perfil de professor.');
            }
        } catch {
            showError('Erro de conexão.');
        } finally {
            setSavingTeacher(false);
        }
    };

    const handleAddAvailability = async () => {
        const token = localStorage.getItem('token');

        // Perfil de professor deve existir antes de adicionar horários
        if (!teacherProfile?.id) {
            showError('Salve o Perfil de Professor antes de cadastrar horários.');
            return;
        }

        setSavingSchedule(true);
        try {
            const res = await fetch(`${url}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    teacherId: teacherProfile.id,
                    dayOfWeek: newAvail.dayWeek,          // campo correto do DTO
                    startTime: `1970-01-01T${newAvail.timeStart}:00.000Z`,
                    endTime: `1970-01-01T${newAvail.timeEnd}:00.000Z`,
                }),
            });

            if (res.ok) {
                const added = await res.json();
                setAvailabilities(prev => [...prev, added]);
                showSuccess('Horário adicionado!');
            } else {
                const err = await res.json().catch(() => ({}));
                showError(err?.message || 'Erro ao salvar horário.');
            }
        } catch {
            showError('Erro de conexão.');
        } finally {
            setSavingSchedule(false);
        }
    };

    const handleDeleteAvailability = async (availId: string) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${url}/availability/${availId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setAvailabilities(prev => prev.filter(a => a.id !== availId));
                showSuccess('Horário removido.');
            } else {
                showError('Erro ao remover horário.');
            }
        } catch {
            showError('Erro de conexão.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/signin');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    const isTeacher = user?.role === 'teacher';

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative overflow-hidden">
            {/* Background decorative */}
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

                {/* Feedback Global */}
                {successMsg && (
                    <div className="mb-6 flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl p-4">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">{successMsg}</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4">
                        <AlertCircle size={18} />
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: User Card */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md mx-auto flex items-center justify-center overflow-hidden">
                                    <UserIcon size={40} className="text-slate-300" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name || 'Usuário'}</h2>
                            <p className="text-sm text-slate-500 mb-4 flex items-center justify-center gap-1">
                                <Mail size={14} /> {user?.email}
                            </p>

                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${isTeacher
                                ? 'bg-green-50 text-green-600 border-green-100'
                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {isTeacher ? 'Professor(a)' : 'Estudante'}
                            </span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configurações</h3>
                            </div>
                            <nav className="flex flex-col">
                                <button
                                    onClick={() => setActiveTab('personal')}
                                    className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === 'personal'
                                        ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500'
                                        : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserIcon size={18} />
                                        <span className="font-medium text-sm">Dados Pessoais</span>
                                    </div>
                                    <ChevronRight size={16} />
                                </button>

                                {isTeacher && (
                                    <>
                                        <button
                                            onClick={() => setActiveTab('teacher')}
                                            className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === 'teacher'
                                                ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500'
                                                : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <GraduationCap size={18} />
                                                <span className="font-medium text-sm">Perfil de Professor</span>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>

                                        <button
                                            onClick={() => setActiveTab('schedule')}
                                            className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === 'schedule'
                                                ? 'bg-rose-50 text-rose-600 border-l-4 border-rose-500'
                                                : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar size={18} />
                                                <span className="font-medium text-sm">Minha Agenda</span>
                                            </div>
                                            <ChevronRight size={16} />
                                        </button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>

                    {/* Right Column: Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Personal Data */}
                        {activeTab === 'personal' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Dados Pessoais</h2>
                                    <p className="text-sm text-slate-500 mt-1">Atualize o nome exibido no seu perfil.</p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Nome de exibição</label>
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={e => setUserName(e.target.value)}
                                            placeholder="Seu nome completo"
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">E-mail</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                disabled
                                                value={user?.email || ''}
                                                className="w-full rounded-xl bg-gray-100 border border-gray-200 p-3 pl-10 text-slate-500 font-medium cursor-not-allowed"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-400">O e-mail não pode ser alterado.</p>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSavePersonal}
                                            disabled={savingPersonal}
                                            className="flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-70"
                                        >
                                            <Save size={16} /> {savingPersonal ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Teacher Profile */}
                        {activeTab === 'teacher' && isTeacher && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Perfil de Professor</h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {teacherProfile ? 'Atualize as informações do seu perfil público.' : 'Preencha seu perfil para aparecer nas buscas de alunos.'}
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                            <GraduationCap size={14} /> Formação / Especialidade
                                        </label>
                                        <input
                                            type="text"
                                            value={training}
                                            onChange={e => setTraining(e.target.value)}
                                            placeholder="Ex: Bacharel em Matemática — USP"
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                            <Phone size={14} /> Telefone / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            value={telephone}
                                            onChange={e => setTelephone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                            <DollarSign size={14} /> Preço por hora (R$)
                                        </label>
                                        <input
                                            type="number"
                                            value={priceHour}
                                            onChange={e => setPriceHour(e.target.value)}
                                            placeholder="Ex: 80"
                                            min="0"
                                            step="0.01"
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                            <span>📍</span> Cidade / Localização
                                        </label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            placeholder="Ex: São Paulo, SP"
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Biografia Profissional</label>
                                        <textarea
                                            rows={5}
                                            value={biography}
                                            onChange={e => setBiography(e.target.value)}
                                            placeholder="Conte sobre sua experiência, metodologia de ensino e o que os alunos podem esperar das suas aulas..."
                                            className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSaveTeacherProfile}
                                            disabled={savingTeacher}
                                            className="flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-70"
                                        >
                                            <Save size={16} /> {savingTeacher ? 'Salvando...' : (teacherProfile ? 'Salvar Alterações' : 'Criar Perfil')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Schedule */}
                        {activeTab === 'schedule' && isTeacher && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-900">Minha Agenda</h2>
                                    <p className="text-sm text-slate-500 mt-1">Defina seus horários de disponibilidade para os alunos agendarem aulas.</p>
                                </div>

                                {!teacherProfile && (
                                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-sm">
                                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                        <p>Preencha primeiro o <button onClick={() => setActiveTab('teacher')} className="font-bold underline">Perfil de Professor</button> antes de configurar a agenda.</p>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Add new slot */}
                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                            <Clock size={16} className="text-rose-500" /> Adicionar Horário
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                            <div>
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
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Início</label>
                                                <input
                                                    type="time"
                                                    value={newAvail.timeStart}
                                                    onChange={e => setNewAvail({ ...newAvail, timeStart: e.target.value })}
                                                    className="w-full rounded-lg bg-white border border-gray-200 p-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Fim</label>
                                                <input
                                                    type="time"
                                                    value={newAvail.timeEnd}
                                                    onChange={e => setNewAvail({ ...newAvail, timeEnd: e.target.value })}
                                                    className="w-full rounded-lg bg-white border border-gray-200 p-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={handleAddAvailability}
                                                    disabled={savingSchedule || !teacherProfile}
                                                    className="w-full rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 p-2.5 text-sm font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} /> {savingSchedule ? 'Adicionando...' : 'Adicionar'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Existing slots */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-3">Horários Cadastrados</h3>
                                        {availabilities.length === 0 ? (
                                            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center">
                                                <Calendar className="text-gray-300 mb-3" size={32} />
                                                <p className="text-sm text-slate-500">Você ainda não tem horários configurados.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {availabilities.map((avail) => {
                                                    const parseTime = (val: string) => {
                                                        try {
                                                            return new Date(val).toISOString().substr(11, 5);
                                                        } catch {
                                                            return val;
                                                        }
                                                    };
                                                    return (
                                                        <div key={avail.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-xs">
                                                                    {daysOfWeek[avail.dayWeek]?.substring(0, 3)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-700">{daysOfWeek[avail.dayWeek]}</div>
                                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                                        <Clock size={11} />
                                                                        {parseTime(avail.timeStart)} — {parseTime(avail.timeEnd)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteAvailability(avail.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
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
