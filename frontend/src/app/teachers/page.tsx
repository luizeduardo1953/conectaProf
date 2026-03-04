'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import { ArrowLeft, User as UserIcon, Calendar, Clock, BookOpen } from 'lucide-react';

export default function TeachersList() {
    const router = useRouter();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbUser, setDbUser] = useState<any>(null);

    const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch student user (to get their ID for booking)
                    const userRes = await fetch(`http://localhost:8000/users/email/${currentUser.email}`);
                    if (userRes.ok) {
                        const userText = await userRes.text();
                        if (userText) {
                            const userData = JSON.parse(userText);
                            setDbUser(userData);
                        }
                    }

                    // Fetch all teachers
                    const res = await fetch('http://localhost:8000/teachers');
                    if (res.ok) {
                        const data = await res.json();
                        setTeachers(data);
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
    }, [router]);

    const handleBookClass = async (teacherId: string, availabilityStr: string) => {
        if (!dbUser) return;

        try {
            // Simplified booking based on the first hour available for demonstration.
            // A real app might have a calendar picker matching the availability days.
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const response = await fetch('http://localhost:8000/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: dbUser.id,
                    teacherId: teacherId,
                    disciplineId: "placeholder-base-id", // Assume basic discipline or optional
                    dateHourStart: tomorrow.toISOString(),
                    dateHourEnd: tomorrow.toISOString(),
                    observation: "Aula agendada pelo sistema."
                })
            });

            if (response.ok) {
                alert('Aula agendada com sucesso!');
                router.push('/dashboard');
            } else {
                alert('Erro ao agendar a aula. Verifique os dados no backend.');
            }
        } catch (error) {
            console.error('Error booking class:', error);
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
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center text-slate-500 hover:text-rose-500 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Voltar ao Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Encontrar Professores</h1>
                </div>

                <div className="space-y-6">
                    {teachers.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-2xl border border-gray-100">
                            <p className="text-slate-500">Nenhum professor encontrado por enquanto.</p>
                        </div>
                    ) : (
                        teachers.map((teacher: any) => (
                            <div key={teacher.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-slate-100 border flex justify-center items-center mb-3">
                                        <UserIcon size={32} className="text-slate-300" />
                                    </div>
                                    <span className="font-bold text-slate-800 text-center">{teacher.user?.name || 'Professor(a)'}</span>
                                    <span className="text-rose-500 font-bold text-sm mt-1">R$ {teacher.priceHour}/h</span>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold mb-2 flex items-center gap-2"><BookOpen size={18} className="text-slate-400" /> Sobre a aula</h3>
                                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                        {teacher.biography || 'Nenhuma biografia fornecida.'}
                                    </p>

                                    <h3 className="font-bold mb-2 flex items-center gap-2"><Calendar size={18} className="text-slate-400" /> Horários Disponíveis</h3>
                                    {teacher.availabilities && teacher.availabilities.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {teacher.availabilities.map((avail: any, idx: number) => {
                                                const timeStart = new Date(avail.timeStart).toISOString().substr(11, 5);
                                                const timeEnd = new Date(avail.timeEnd).toISOString().substr(11, 5);
                                                return (
                                                    <div key={idx} className="bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                                                        <Clock size={12} /> {daysOfWeek[avail.dayWeek]}: {timeStart} às {timeEnd}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Professor não possui horários cadastrados.</p>
                                    )}
                                </div>
                                <div className="flex flex-col justify-center">
                                    <button
                                        onClick={() => handleBookClass(teacher.id, '')}
                                        disabled={!teacher.availabilities || teacher.availabilities.length === 0}
                                        className="w-full md:w-auto mt-4 md:mt-0 whitespace-nowrap bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Agendar Aula
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
