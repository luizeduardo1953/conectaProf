'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, LogOut, Calendar, BookOpen, Search, MapPin, Clock, MonitorPlay
} from 'lucide-react';


export default function Dashboard() {
    const router = useRouter();
    const [dbUser, setDbUser] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');

    const url = process.env.NEXT_PUBLIC_URL_BACKEND;

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const getMe = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }
        const response = await fetch(`${url}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            router.push('/signin');
            return;
        }

        const data = await response.json();
        setDbUser(data);
    }

    const getTeachers = async () => {

        const token = localStorage.getItem('token');
        
        if (!token) {
            router.push('/signin');
            return;
        }
        const response = await fetch(`${url}/users/teachers`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            router.push('/signin');
            return;
        }

        const data = await response.json();
        setTeachers(data);
    }

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = teacher.city.toLowerCase().includes(locationQuery.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    useEffect(() => {
        getMe();
        getTeachers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-4 sm:p-8 relative overflow-hidden">
            {/* Header / Navbar */}
            <header className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Olá, {dbUser?.name?.split(' ')[0] || 'Aluno(a)'}!</h1>
                        <p className="text-sm text-slate-500">
                            {dbUser?.role === 'teacher' ? 'Painel do Professor' : 'Painel do Aluno'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => router.push('/profile')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 px-4 font-bold text-slate-700 transition active:scale-[0.98]"
                    >
                        Meu Perfil
                    </button>
                    <button
                        onClick={() => router.push('/signin')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-4 font-bold text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition active:scale-[0.98]"
                    >
                        <LogOut size={18} /> Sair
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 w-full max-w-6xl mx-auto flex-grow flex flex-col gap-8">

                {/* TEACHER VIEW */}
                {dbUser?.role === 'teacher' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto mt-12">
                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Gerencie suas aulas</h2>
                        <p className="text-slate-500 mb-8 text-lg">
                            Bem-vindo ao seu painel! Acesse o seu perfil para configurar seus dias e horários disponíveis para que os alunos possam te encontrar.
                        </p>
                        <button
                            onClick={() => router.push('/profile')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 py-4 px-8 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98] text-lg"
                        >
                            <Calendar size={20} /> Configurar Minha Agenda
                        </button>
                    </div>
                )}

                {/* STUDENT VIEW */}
                {dbUser?.role === 'student' && (
                    <>
                        {/* Search Bar */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar por disciplina ou nome do professor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-slate-700 font-medium"
                                />
                            </div>
                            <div className="md:w-1/3 relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Localização (Ex: São Paulo, Online)"
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition text-slate-700 font-medium"
                                />
                            </div>
                        </div>

                        {/* Teachers Grid */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <MonitorPlay className="text-rose-500" /> Professores Disponíveis
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                                {filteredTeachers.length === 0 ? (
                                    <div className="col-span-full text-center p-16 bg-white rounded-3xl border border-gray-100 border-dashed">
                                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhum professor encontrado</h3>
                                        <p className="text-slate-500">Tente ajustar seus termos de busca.</p>
                                    </div>
                                ) : (
                                    filteredTeachers.map((teacher: any) => (
                                        <div key={teacher.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col gap-5 group">

                                            {/* Teacher Header */}
                                            <div className="flex gap-4 items-center border-b border-gray-50 pb-4">
                                                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm flex justify-center items-center flex-shrink-0 relative overflow-hidden">
                                                    <User size={28} className="text-slate-400" />
                                                    <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-bold text-lg text-slate-900">{teacher.user?.name || 'Professor(a)'}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="p-1.5 bg-slate-50 rounded-lg">
                                                            {"getSubjectIcon(teacher.biography + ' ' + teacher.training)"}
                                                        </div>
                                                        <span className="text-sm text-slate-500 font-medium truncate max-w-[150px]">
                                                            {teacher.training || 'Diversas Matérias'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end justify-center">
                                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Preço/Hora</span>
                                                    <span className="text-rose-500 font-bold text-xl bg-rose-50 px-3 py-1 rounded-lg">R$ {teacher.priceHour}</span>
                                                </div>
                                            </div>

                                            {/* Teacher Bio */}
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                                                    <BookOpen size={16} className="text-slate-400" /> Resumo
                                                </h4>
                                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                                                    {teacher.biography || 'Nenhuma biografia fornecida por este professor.'}
                                                </p>
                                            </div>

                                            {/* Availabilities Grid */}
                                            <div className="bg-slate-50 p-4 rounded-xl">
                                                <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-400" />  Horários
                                                </h4>
                                                {teacher.availabilities && teacher.availabilities.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {teacher.availabilities.slice(0, 4).map((avail: any, idx: number) => {
                                                            const timeStart = new Date(avail.timeStart).toISOString().substr(11, 5);
                                                            const timeEnd = new Date(avail.timeEnd).toISOString().substr(11, 5);
                                                            return (
                                                                <div key={idx} className="bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                                    <span className="font-medium">{daysOfWeek[avail.dayWeek].substring(0, 3)}</span>
                                                                    <span className="text-slate-400">|</span>
                                                                    <span>{timeStart}</span>
                                                                </div>
                                                            )
                                                        })}
                                                        {teacher.availabilities.length > 4 && (
                                                            <div className="bg-slate-200/50 text-slate-500 text-xs px-2.5 py-1.5 rounded-md flex items-center font-medium">
                                                                +{teacher.availabilities.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-400 italic">Sem horários cadastrados.</p>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                onClick={() => "handleBookClass(teacher.id)"}
                                                disabled={!teacher.availabilities || teacher.availabilities.length === 0}
                                                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-rose-500 flex justify-center items-center gap-2"
                                            >
                                                Agendar Primeira Aula <User className="w-4 h-4 opacity-70" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
