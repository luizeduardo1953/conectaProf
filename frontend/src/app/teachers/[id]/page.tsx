'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import { ArrowLeft, User as UserIcon, Calendar, Clock, BookOpen, Star, MessageCircle, MapPin, GraduationCap } from 'lucide-react';

export default function TeacherProfile({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const teacherId = resolvedParams.id;
    
    const [teacher, setTeacher] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState<any>(null);
    const [bookingMsg, setBookingMsg] = useState("");

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userRes = await fetch(`http://localhost:8000/users/email/${currentUser.email}`);
                    if (userRes.ok) {
                        const userText = await userRes.text();
                        if (userText) {
                            setDbUser(JSON.parse(userText));
                        }
                    }

                    const res = await fetch(`http://localhost:8000/teachers/detail/${teacherId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setTeacher(data);
                    } else {
                        console.error('Teacher not found');
                        router.push('/teachers');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, teacherId]);

    const handleBookClass = async () => {
        if (!dbUser || !teacher) return;
        setBookingMsg("");

        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const disciplineId = teacher.disciplines?.length > 0 
                ? teacher.disciplines[0].disciplineId 
                : "placeholder-base-id";

            const response = await fetch('http://localhost:8000/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: dbUser.id,
                    teacherId: teacher.id,
                    disciplineId: disciplineId,
                    dateHourStart: tomorrow.toISOString(),
                    dateHourEnd: tomorrow.toISOString(),
                    observation: "Aula agendada via Perfil."
                })
            });

            if (response.ok) {
                setBookingMsg("Aula agendada com sucesso!");
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setBookingMsg("Erro ao agendar a aula. Verifique os dados no backend.");
            }
        } catch (error) {
            console.error('Error booking class:', error);
            setBookingMsg("Erro de comunicação ao agendar aula.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!teacher) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
            {/* Header / Cover */}
            <div className="bg-slate-900 h-48 sm:h-64 w-full relative">
                <button
                    onClick={() => router.push('/teachers')}
                    className="absolute top-6 left-6 flex items-center text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm"
                >
                    <ArrowLeft size={18} className="mr-2" /> Voltar
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-20 sm:-mt-24 relative z-10">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Top Section */}
                    <div className="p-6 sm:p-10 border-b border-gray-100 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-slate-100 border-4 border-white shadow-xl flex justify-center items-center overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50">
                                {teacher.user?.avatarUrl ? (
                                    <img src={teacher.user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon size={64} className="text-rose-200" />
                                )}
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left pt-2 pb-4">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{teacher.user?.name || 'Professor'}</h1>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-6 text-sm text-slate-500 mb-6">
                                {teacher.training && (
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <GraduationCap size={16} className="text-slate-400" />
                                        <span>{teacher.training}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span>Remoto</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100 text-amber-700">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="font-semibold">5.0</span>
                                </div>
                            </div>

                            {/* Disciplines tags */}
                            {teacher.disciplines && teacher.disciplines.length > 0 && (
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                                    {teacher.disciplines.map((td: any) => (
                                        <span key={td.id} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full text-sm font-medium">
                                            {td.discipline?.name || 'Disciplina'}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-rose-50 rounded-2xl p-6 border border-rose-100 min-w-[200px]">
                            <span className="text-rose-400 font-medium mb-1">Valor por hora</span>
                            <div className="text-3xl font-bold text-rose-600 mb-4">R$ {teacher.priceHour}</div>
                            
                            <button
                                onClick={handleBookClass}
                                disabled={!teacher.availabilities || teacher.availabilities.length === 0}
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex justify-center items-center gap-2"
                            >
                                <Calendar size={18} />
                                Agendar Aula
                            </button>
                            {bookingMsg && (
                                <p className="text-green-600 text-sm mt-3 font-medium text-center">{bookingMsg}</p>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        {/* Biografia e Detalhes */}
                        <div className="p-6 sm:p-10 lg:w-2/3">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <BookOpen size={22} className="text-rose-500" /> 
                                Sobre mim
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {teacher.biography || 'Este professor ainda não adicionou uma biografia detalhada.'}
                            </div>
                        </div>

                        {/* Horários e Contato */}
                        <div className="p-6 sm:p-10 lg:w-1/3 bg-slate-50/50">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Clock size={22} className="text-rose-500" /> 
                                Horários
                            </h2>
                            
                            <div className="space-y-3 mb-8">
                                {teacher.availabilities && teacher.availabilities.length > 0 ? (
                                    teacher.availabilities.map((avail: any, idx: number) => {
                                        const timeStart = new Date(avail.timeStart).toISOString().substr(11, 5);
                                        const timeEnd = new Date(avail.timeEnd).toISOString().substr(11, 5);
                                        return (
                                            <div key={idx} className="flex justify-between items-center bg-white border border-gray-100 px-4 py-3 rounded-xl shadow-sm">
                                                <span className="font-medium text-slate-700">{daysOfWeek[avail.dayWeek]}</span>
                                                <div className="text-rose-500 font-semibold bg-rose-50 px-2 py-1 rounded-md text-sm">
                                                    {timeStart} - {timeEnd}
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

                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 mt-8">
                                <MessageCircle size={22} className="text-rose-500" /> 
                                Contato
                            </h2>

                            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                                <p className="text-slate-600 font-medium mb-1">Telefone / WhatsApp</p>
                                <p className="text-slate-800 font-bold text-lg">{teacher.telephone || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
