'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, LogOut, Calendar, Search, Clock, MonitorPlay, X,
    MapPin, DollarSign, SlidersHorizontal, ChevronDown,
    GraduationCap, Star, ArrowRight, BookOpen, Sparkles,
    Users, Quote
} from 'lucide-react';
import SchedulingModal from '@/components/SchedulingModal';

const PRICE_PRESETS = [
    { label: 'Qualquer preço', min: 0, max: Infinity },
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50 – R$ 100', min: 50, max: 100 },
    { label: 'R$ 100 – R$ 150', min: 100, max: 150 },
    { label: 'Acima de R$ 150', min: 150, max: Infinity },
];

const TESTIMONIALS = [
    {
        name: 'Larissa Mendonça',
        role: 'Estudante de Engenharia',
        avatar: 'L',
        color: 'from-rose-100 to-orange-50',
        text: 'Encontrei meu professor de Cálculo em minutos. As aulas são incríveis e minha nota subiu de 6 para 9 em um semestre. O ConectaProf mudou minha trajetória acadêmica.',
        stars: 5,
        city: 'São Paulo, SP',
    },
    {
        name: 'Pedro Almeida',
        role: 'Preparatório ENEM',
        avatar: 'P',
        color: 'from-blue-100 to-indigo-50',
        text: 'Fiz aulas de Física e Química com professores incríveis. A plataforma é super fácil de usar e os professores são muito bem preparados. Consegui aprovação no curso que tanto queria!',
        stars: 5,
        city: 'Rio de Janeiro, RJ',
    },
    {
        name: 'Camila Torres',
        role: 'Profissional em transição',
        avatar: 'C',
        color: 'from-emerald-100 to-teal-50',
        text: 'Aprendi programação do zero com um professor incrível. Em 6 meses já consegui meu primeiro emprego como dev. A qualidade dos professores é impressionante.',
        stars: 5,
        city: 'Belo Horizonte, MG',
    },
    {
        name: 'Rafael Nogueira',
        role: 'Aluno do Ensino Médio',
        avatar: 'R',
        color: 'from-violet-100 to-purple-50',
        text: 'Minhas notas em Matemática eram péssimas. Depois de 3 meses com meu professor no ConectaProf, tirei 900 no ENEM! Recomendo demais para qualquer estudante.',
        stars: 5,
        city: 'Campinas, SP',
    },
    {
        name: 'Ana Paula Ribeiro',
        role: 'Concurseira',
        avatar: 'A',
        color: 'from-pink-100 to-rose-50',
        text: 'Me sentia perdida estudando sozinha para o concurso. Aqui encontrei professores de Português e História que me deram um rumo. Aprovada em primeiro lugar!',
        stars: 5,
        city: 'Brasília, DF',
    },
];

export default function Dashboard() {
    const router = useRouter();
    const [dbUser, setDbUser] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [locationQuery, setLocationQuery] = useState('');
    const [pricePreset, setPricePreset] = useState(0);
    const [showFilters, setShowFilters] = useState(false);

    const url = process.env.NEXT_PUBLIC_URL_BACKEND;
    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    useEffect(() => {
        const init = async () => {
            const tok = localStorage.getItem('token');
            if (!tok) { router.push('/signin'); return; }
            try {
                const userRes = await fetch(`${url}/users/me`, { headers: { Authorization: `Bearer ${tok}` } });
                if (!userRes.ok) { router.push('/signin'); return; }
                setDbUser(await userRes.json());
                const teachersRes = await fetch(`${url}/teachers`);
                if (teachersRes.ok) setTeachers(await teachersRes.json());
            } catch { router.push('/signin'); }
            finally { setLoading(false); }
        };
        init();
    }, [router, url]);

    const handleLogout = () => { localStorage.removeItem('token'); router.push('/signin'); };

    const availableLocations = useMemo(() =>
        [...new Set(teachers.map(t => t.location).filter(Boolean))], [teachers]);

    const activeFilters = [searchQuery.trim(), selectedDay !== null, locationQuery.trim(), pricePreset !== 0]
        .filter(Boolean).length;

    const clearFilters = () => {
        setSearchQuery(''); setSelectedDay(null); setLocationQuery(''); setPricePreset(0);
    };

    const { min: priceMin, max: priceMax } = PRICE_PRESETS[pricePreset];

    const filteredTeachers = useMemo(() => teachers.filter(t => {
        const q = searchQuery.toLowerCase();
        return (
            (!q || t.user?.name?.toLowerCase().includes(q) || t.training?.toLowerCase().includes(q) || t.biography?.toLowerCase().includes(q)) &&
            (selectedDay === null || t.availabilities?.some((a: any) => a.dayWeek === selectedDay)) &&
            (!locationQuery.trim() || t.location?.toLowerCase().includes(locationQuery.toLowerCase())) &&
            ((t.priceHour ?? 0) >= priceMin && (t.priceHour ?? 0) <= priceMax)
        );
    }), [teachers, searchQuery, selectedDay, locationQuery, priceMin, priceMax]);

    const uniqueLocations = useMemo(() =>
        new Set(teachers.map(t => t.location).filter(Boolean)).size, [teachers]);

    // Simulated student count based on teachers * avg students
    const estimatedStudents = teachers.length * 18 + 47;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-100/60 blur-[120px]" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-50/70 blur-[100px]" />
            </div>

            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center font-black text-white text-lg shadow-md shadow-rose-500/25">
                                {dbUser?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Bem-vindo de volta</p>
                            <h1 className="text-base font-bold text-slate-800">{dbUser?.name?.split(' ')[0] || 'Usuário'}</h1>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm shadow-rose-500/30">
                            <Sparkles size={13} className="text-white" />
                        </div>
                        <span className="font-extrabold text-slate-800 tracking-tight text-lg">ConectaProf</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => router.push('/classes')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-bold transition-all">
                            <Calendar size={15} /> Aulas
                        </button>
                        <button onClick={() => router.push('/profile')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold transition-all shadow-sm">
                            <User size={15} /> Perfil
                        </button>
                        <button onClick={handleLogout} className="p-2.5 rounded-xl bg-white border border-gray-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm" title="Sair">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

                {/* ══ TEACHER PANEL ══ */}
                {dbUser?.role === 'teacher' && (
                    <div className="animate-fade-in-up">
                        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-slate-200/50 p-10 md:p-16 text-center">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />
                            <div className="absolute top-[-20%] right-[-5%] w-[300px] h-[300px] rounded-full bg-rose-100/50 blur-[80px] pointer-events-none" />
                            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-rose-100">
                                <MonitorPlay size={36} className="text-rose-500" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Gerencie seu conhecimento</h2>
                            <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-xl mx-auto">
                                Mantenha seu perfil atualizado e defina seus horários para que novos alunos possam te encontrar.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => router.push('/profile')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 py-4 px-8 font-bold text-white shadow-lg shadow-rose-500/30 hover:-translate-y-0.5 transition-all">
                                    <Calendar size={18} /> Configurar Agenda
                                </button>
                                <button onClick={() => router.push('/classes')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 py-4 px-8 font-bold text-slate-700 transition-all">
                                    <MonitorPlay size={18} /> Ver Minhas Aulas
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ STUDENT PANEL ══ */}
                {dbUser?.role === 'student' && (
                    <div className="flex flex-col gap-8">

                        {/* ── Search + Filters ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex gap-3 items-center">
                                <div className="flex-1 relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar professor, disciplina ou especialidade..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>
                                    )}
                                </div>
                                <button onClick={() => setShowFilters(f => !f)}
                                    className={`relative flex items-center gap-2 px-5 py-3.5 rounded-xl border font-bold text-sm transition-all flex-shrink-0 ${showFilters ? 'bg-slate-800 border-slate-800 text-white shadow-md' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}`}>
                                    <SlidersHorizontal size={16} />
                                    <span className="hidden sm:inline">Filtros</span>
                                    {activeFilters > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">{activeFilters}</span>}
                                    <ChevronDown size={13} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {showFilters && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-gray-100">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dia disponível</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[{ label: 'Todos', val: null }, ...[1, 2, 3, 4, 5].map(d => ({ label: daysOfWeek[d].substring(0, 3), val: d }))].map(({ label, val }) => (
                                                <button key={label} onClick={() => setSelectedDay(val)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedDay === val ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Localização</span>
                                        <div className="relative">
                                            <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input type="text" list="locs" placeholder="Ex: São Paulo, SP" value={locationQuery} onChange={e => setLocationQuery(e.target.value)}
                                                className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all" />
                                            <datalist id="locs">{availableLocations.map(l => <option key={l} value={l} />)}</datalist>
                                            {locationQuery && <button onClick={() => setLocationQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preço / hora</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {PRICE_PRESETS.map((p, i) => (
                                                <button key={i} onClick={() => setPricePreset(i)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${pricePreset === i ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                                    {p.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeFilters > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                                    <span className="text-xs text-slate-400 font-semibold">Ativos:</span>
                                    {selectedDay !== null && <FilterTag color="rose" onRemove={() => setSelectedDay(null)}>{daysOfWeek[selectedDay]}</FilterTag>}
                                    {locationQuery && <FilterTag color="blue" onRemove={() => setLocationQuery('')}><MapPin size={9} />{locationQuery}</FilterTag>}
                                    {pricePreset !== 0 && <FilterTag color="emerald" onRemove={() => setPricePreset(0)}><DollarSign size={9} />{PRICE_PRESETS[pricePreset].label}</FilterTag>}
                                    <button onClick={clearFilters} className="ml-auto text-xs text-slate-400 hover:text-rose-500 font-bold transition-colors">Limpar todos</button>
                                </div>
                            )}
                        </div>

                        {/* ── Results header ── */}
                        <div className="flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-extrabold text-slate-800">Professores</h2>
                                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{filteredTeachers.length}</span>
                            </div>
                            {activeFilters > 0 && (
                                <p className="text-xs text-slate-400 italic">{teachers.length - filteredTeachers.length} ocultado(s) por filtros</p>
                            )}
                        </div>

                        {/* ── Teachers Grid ── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {filteredTeachers.length === 0 ? (
                                <div className="col-span-full py-24 bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5">
                                        <Search className="text-slate-300" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum professor encontrado</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">Tente outros termos ou remova alguns filtros.</p>
                                    <button onClick={clearFilters} className="mt-6 text-rose-500 text-sm font-bold hover:text-rose-600 transition-colors">Limpar filtros →</button>
                                </div>
                            ) : (
                                filteredTeachers.map((teacher: any, index) => (
                                    <TeacherCard
                                        key={teacher.id}
                                        teacher={teacher}
                                        daysOfWeek={daysOfWeek}
                                        index={index}
                                        onSchedule={() => setSelectedTeacher(teacher)}
                                        onProfile={() => router.push(`/teachers/${teacher.id}`)}
                                    />
                                ))
                            )}
                        </div>


                        {/* ── Platform Stats Banner ── */}
                        <div className="relative overflow-hidden rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            {/* Rich background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800" />
                            <div className="absolute top-[-30%] right-[-10%] w-64 h-64 bg-rose-500/15 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute bottom-[-30%] left-[-5%] w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="relative z-10 px-8 py-14 sm:py-16 flex flex-col items-center gap-10">
                                {/* Label */}
                                <span className="inline-flex items-center gap-1.5 bg-white/8 border border-white/10 text-white/60 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                    Plataforma em números
                                </span>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-8 sm:gap-16 w-full max-w-2xl">
                                    {[
                                        { icon: GraduationCap, label: 'Professores ativos', value: teachers.length, color: 'text-rose-400' },
                                        { icon: MapPin, label: 'Cidades atendidas', value: uniqueLocations, color: 'text-blue-400' },
                                        { icon: Users, label: 'Alunos cadastrados', value: `+${estimatedStudents}`, color: 'text-emerald-400' },
                                    ].map(({ icon: Icon, label, value, color }) => (
                                        <div key={label} className="flex flex-col items-center gap-3 text-center">
                                            <div className="w-12 h-12 rounded-2xl bg-white/6 border border-white/8 flex items-center justify-center">
                                                <Icon size={20} className={color} />
                                            </div>
                                            <p className={`text-3xl sm:text-4xl font-black ${color}`}>{value}</p>
                                            <p className="text-xs text-white/40 font-semibold leading-snug">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Testimonials ── */}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            {/* Section header */}
                            <div className="text-center mb-8">
                                <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                                    <Star size={12} className="fill-rose-500" /> Depoimentos
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
                                    O que nossos alunos dizem
                                </h2>
                                <p className="text-slate-500 text-sm max-w-md mx-auto">
                                    Histórias reais de estudantes que transformaram seu desempenho com o ConectaProf.
                                </p>
                            </div>

                            {/* Testimonials grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {TESTIMONIALS.slice(0, 3).map((t, i) => (
                                    <TestimonialCard key={t.name} testimonial={t} index={i} />
                                ))}
                            </div>

                            {/* Second row — 2 centered */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 max-w-3xl mx-auto">
                                {TESTIMONIALS.slice(3).map((t, i) => (
                                    <TestimonialCard key={t.name} testimonial={t} index={i + 3} />
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 mt-8 border-t border-gray-100 bg-white">
                {/* Top section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand column */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm shadow-rose-500/30">
                                <Sparkles size={15} className="text-white" />
                            </div>
                            <span className="font-extrabold text-slate-800 text-lg tracking-tight">ConectaProf</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                            Conectamos alunos a professores qualificados para aulas particulares em todo o Brasil. Aprenda com quem sabe de verdade.
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            {[
                                { label: 'Instagram', icon: '📸' },
                                { label: 'LinkedIn', icon: '💼' },
                                { label: 'YouTube', icon: '▶️' },
                            ].map(s => (
                                <button key={s.label} title={s.label} className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center text-sm transition-all" aria-label={s.label}>
                                    {s.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Platform links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Plataforma</h4>
                        <ul className="flex flex-col gap-2.5">
                            {[
                                { label: 'Dashboard', href: '/dashboard' },
                                { label: 'Meu Perfil', href: '/profile' },
                                { label: 'Minhas Aulas', href: '/classes' },
                                { label: 'Encontrar Professor', href: '/dashboard' },
                            ].map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-slate-500 hover:text-rose-500 font-medium transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Suporte</h4>
                        <ul className="flex flex-col gap-2.5">
                            {['Central de Ajuda', 'Como Funciona', 'Seja um Professor', 'Política de Privacidade', 'Termos de Uso'].map(item => (
                                <li key={item}>
                                    <button className="text-sm text-slate-500 hover:text-rose-500 font-medium transition-colors text-left">
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact + Newsletter */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Contato</h4>
                        <ul className="flex flex-col gap-3">
                            {[
                                { icon: '✉️', text: 'contato@conectaprof.com.br' },
                                { icon: '📞', text: '(11) 4000-0000' },
                                { icon: '📍', text: 'São Paulo, SP — Brasil' },
                            ].map(item => (
                                <li key={item.text} className="flex items-start gap-2.5">
                                    <span className="text-base mt-0.5">{item.icon}</span>
                                    <span className="text-sm text-slate-500 font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-1 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                            <p className="text-xs font-bold text-rose-700 mb-1">📬 Fique por dentro</p>
                            <p className="text-xs text-rose-600/70 mb-3">Receba dicas e novidades da plataforma.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-rose-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 transition-all min-w-0"
                                />
                                <button className="text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-lg transition-all flex-shrink-0">OK</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-100 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 font-medium">
                        <p>© {new Date().getFullYear()} ConectaProf. Todos os direitos reservados.</p>
                        <div className="flex items-center gap-1">
                            <span>Feito com</span>
                            <span className="text-rose-500 mx-0.5">♥</span>
                            <span>para quem ama aprender</span>
                        </div>
                    </div>
                </div>
            </footer>

            {selectedTeacher && (
                <SchedulingModal
                    teacher={selectedTeacher}
                    disciplines={disciplines}
                    onClose={() => setSelectedTeacher(null)}
                    onSuccess={() => { setSelectedTeacher(null); router.push('/classes'); }}
                />
            )}
        </div>
    );
}

// ── Filter tag ──
function FilterTag({ children, color, onRemove }: { children: React.ReactNode; color: string; onRemove: () => void }) {
    const cls: Record<string, string> = {
        rose: 'bg-rose-50 border-rose-100 text-rose-600',
        blue: 'bg-blue-50 border-blue-100 text-blue-600',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    };
    return (
        <span className={`flex items-center gap-1.5 border text-xs font-bold px-2.5 py-1 rounded-full ${cls[color]}`}>
            {children}
            <button onClick={onRemove} className="opacity-50 hover:opacity-100 transition-opacity"><X size={10} /></button>
        </span>
    );
}

// ── Teacher Card ──
function TeacherCard({ teacher, daysOfWeek, index, onSchedule, onProfile }: any) {
    const hasAvail = teacher.availabilities?.length > 0;
    const uniqueDays: number[] = [...new Set<number>(teacher.availabilities?.map((a: any) => a.dayWeek as number) ?? [])];
    const accents = ['bg-rose-500', 'bg-orange-400', 'bg-pink-500', 'bg-red-500', 'bg-rose-400', 'bg-red-400'];
    const avatarGrads = ['from-rose-100 to-orange-50', 'from-orange-100 to-amber-50', 'from-pink-100 to-rose-50', 'from-red-100 to-rose-50', 'from-rose-100 to-pink-50', 'from-amber-100 to-orange-50'];
    const idx = (teacher.user?.name?.charCodeAt(0) ?? 0) % accents.length;

    return (
        <div className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${0.06 * index}s` }}>
            <div className={`h-1 w-full ${accents[idx]}`} />
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarGrads[idx]} border border-white shadow-sm flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xl font-black text-rose-400">{teacher.user?.name?.charAt(0) || '?'}</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-base text-slate-800 truncate">{teacher.user?.name || 'Professor(a)'}</h3>
                            <p className="text-xs text-slate-500 truncate mt-0.5">{teacher.training || 'Diversas Matérias'}</p>
                            {teacher.location && <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin size={10} /> {teacher.location}</p>}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-center">
                            <p className="text-green-700 font-black text-base leading-none">R${teacher.priceHour ?? '—'}</p>
                            <p className="text-green-500/70 text-[10px] font-semibold">/hora</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 flex-grow">
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 border-l-2 border-slate-100 pl-3">
                    {teacher.biography || <span className="italic text-slate-400">Nenhuma biografia informada.</span>}
                </p>
            </div>
            <div className="px-6 pt-4 flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                    {hasAvail ? uniqueDays.map(d => (
                        <span key={d} className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">{daysOfWeek[d]}</span>
                    )) : (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg flex items-center gap-1"><Clock size={10} /> Sem horários</span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />)}
                    <span className="text-xs text-slate-400 font-medium ml-1">4.0</span>
                </div>
            </div>
            <div className="p-6 pt-4 flex gap-2.5">
                <button onClick={onProfile} className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5">
                    <BookOpen size={13} /> Ver Perfil
                </button>
                <button onClick={onSchedule} disabled={!hasAvail} className="flex-[1.5] py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/25 active:scale-95">
                    <Calendar size={13} /> Agendar Aula <ArrowRight size={12} className="opacity-70" />
                </button>
            </div>
        </div>
    );
}

// ── Testimonial Card ──
function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
    return (
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-300 p-6 flex flex-col gap-5 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${0.08 * index}s` }}>

            {/* Decorative quote mark */}
            <div className="absolute top-4 right-5 opacity-5">
                <Quote size={64} className="text-slate-800 fill-slate-800" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
                {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
            </div>

            {/* Quote text */}
            <p className="text-slate-600 text-sm leading-relaxed flex-grow relative z-10">
                "{testimonial.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${testimonial.color} border border-white shadow-sm flex items-center justify-center flex-shrink-0`}>
                    <span className="font-black text-rose-400 text-sm">{testimonial.avatar}</span>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{testimonial.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{testimonial.role}</p>
                </div>
                <div className="ml-auto flex-shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                        <MapPin size={9} /> {testimonial.city}
                    </span>
                </div>
            </div>
        </div>
    );
}
