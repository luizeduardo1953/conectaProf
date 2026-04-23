'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User as UserIcon, Calendar, Clock, BookOpen, Star, MessageCircle, MapPin, GraduationCap, X } from 'lucide-react';
import SchedulingModal from '@/components/SchedulingModal';

export default function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const teacherId = resolvedParams.id;

    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState<any>(null);
    const [disciplines, setDisciplines] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const url = process.env.NEXT_PUBLIC_URL_BACKEND;

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/signin');
                return;
            }

            try {
                // Buscar usuário atual
                const userRes = await fetch(`${url}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (userRes.ok) {
                    setDbUser(await userRes.json());
                }

                // Buscar professor
                const teacherRes = await fetch(`${url}/teachers/${teacherId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (teacherRes.ok) {
                    setTeacher(await teacherRes.json());
                } else {
                    router.push('/dashboard');
                    return;
                }

                // Buscar disciplinas do professor (se ele tiver)
                // Tentar via /discipline usando token
                try {
                    const discRes = await fetch(`${url}/discipline`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (discRes.ok) {
                        setDisciplines(await discRes.json());
                    }
                } catch {
                    // Disciplines são opcionais no modal
                }
            } catch {
                router.push('/signin');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router, teacherId, url]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!teacher) return null;

    const isStudent = dbUser?.role === 'student';
    const hasAvailabilities = teacher.availabilities?.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">

            {/* Header / Cover */}
            <div className="bg-slate-900 h-48 sm:h-64 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-900/40"></div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="absolute top-6 left-6 flex items-center text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm z-10"
                >
                    <ArrowLeft size={18} className="mr-2" /> Voltar
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-20 sm:-mt-24 relative z-10">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Top Section */}
                    <div className="p-6 sm:p-10 border-b border-gray-100 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 border-4 border-white shadow-xl flex justify-center items-center overflow-hidden">
                                {teacher.user?.avatarUrl ? (
                                    <img src={teacher.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={64} className="text-rose-200" />
                                )}
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left pt-2">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{teacher.user?.name || 'Professor'}</h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 text-sm text-slate-500 mb-4">
                                {teacher.training && (
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <GraduationCap size={15} className="text-slate-400" />
                                        <span>{teacher.training}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <MapPin size={15} className="text-slate-400" />
                                    <span>Remoto</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-amber-700">
                                    <Star size={15} className="text-amber-400 fill-amber-400" />
                                    <span className="font-semibold">5.0</span>
                                </div>
                            </div>

                            {teacher.disciplines?.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                    {teacher.disciplines.map((td: any) => (
                                        <span key={td.id} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-sm font-medium">
                                            {td.discipline?.name || 'Disciplina'}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-rose-50 rounded-2xl p-6 border border-rose-100 min-w-[200px] gap-3">
                            <span className="text-rose-400 font-medium text-sm">Valor por hora</span>
                            <div className="text-3xl font-bold text-rose-600">R$ {teacher.priceHour ?? '—'}</div>

                            {isStudent ? (
                                <button
                                    onClick={() => setShowModal(true)}
                                    disabled={!hasAvailabilities}
                                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    <Calendar size={18} /> Agendar Aula
                                </button>
                            ) : (
                                <div className="w-full text-center text-xs text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-100">
                                    Agendamento disponível para alunos
                                </div>
                            )}

                            {!hasAvailabilities && isStudent && (
                                <p className="text-xs text-slate-500 text-center">Professor sem horários disponíveis no momento.</p>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        {/* Biografia */}
                        <div className="p-6 sm:p-10 lg:w-2/3">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen size={22} className="text-rose-500" />
                                Sobre mim
                            </h2>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {teacher.biography || 'Este professor ainda não adicionou uma biografia detalhada.'}
                            </div>
                        </div>

                        {/* Horários e Contato */}
                        <div className="p-6 sm:p-10 lg:w-1/3 bg-slate-50/50">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Clock size={22} className="text-rose-500" />
                                Disponibilidade
                            </h2>

                            <div className="space-y-2 mb-8">
                                {hasAvailabilities ? (
                                    teacher.availabilities.map((avail: any, idx: number) => {
                                        let timeStart = avail.timeStart;
                                        let timeEnd = avail.timeEnd;
                                        try {
                                            timeStart = new Date(avail.timeStart).toISOString().substr(11, 5);
                                            timeEnd = new Date(avail.timeEnd).toISOString().substr(11, 5);
                                        } catch { }
                                        return (
                                            <div key={idx} className="flex justify-between items-center bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-sm">
                                                <span className="font-medium text-slate-700">{daysOfWeek[avail.dayWeek]}</span>
                                                <div className="text-rose-500 font-semibold bg-rose-50 px-2 py-1 rounded-md text-sm">
                                                    {timeStart} — {timeEnd}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
                                        <p className="text-sm text-slate-500">Nenhum horário cadastrado no momento.</p>
                                    </div>
                                )}
                            </div>

                            {teacher.telephone && (
                                <>
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <MessageCircle size={22} className="text-rose-500" />
                                        Contato
                                    </h2>
                                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                                        <p className="text-slate-600 font-medium mb-1">Telefone / WhatsApp</p>
                                        <p className="text-slate-800 font-bold text-lg">{teacher.telephone}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scheduling Modal */}
            {showModal && (
                <SchedulingModal
                    teacher={teacher}
                    disciplines={disciplines}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        router.push('/classes');
                    }}
                />
            )}
        </div>
    );
}
