'use client';

import { useState } from 'react';
import { Mail, Lock, User, GraduationCap, School, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student'); // Estado para tipo de usuário
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar no banco de dados');
            }

            // 3. Só redireciona se tudo acima funcionou
            router.push('/signin');
        } catch (error) {
            console.error('Erro no registro:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 font-sans text-slate-800 flex items-center justify-center p-4 relative overflow-hidden">

            {/* --- Background Decorativo (Igual ao Login) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-rose-100 opacity-40 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-blue-50 opacity-40 blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* --- Lado Esquerdo: Formulário --- */}
                <div className="p-8 sm:p-12 order-2 lg:order-1">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.location.href = '/'}>
                            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                            <span className="text-xl font-bold text-slate-900">ConectaProf</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Crie sua conta</h2>
                        <p className="text-slate-500 mt-2">Junte-se à nossa comunidade de aprendizado.</p>
                    </div>

                    <form onSubmit={handleSignUp} className="flex flex-col gap-5">

                        {/* Seletor de Perfil (Destaque da Página de Registro) */}
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${role === 'student'
                                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                                    : 'border-gray-100 bg-white text-slate-400 hover:border-gray-200'
                                    }`}
                            >
                                <GraduationCap size={24} />
                                <span className="text-sm font-bold">Quero Aprender</span>
                                {role === 'student' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircle2 size={16} /></div>}
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${role === 'teacher'
                                    ? 'border-rose-500 bg-rose-50 text-rose-700'
                                    : 'border-gray-100 bg-white text-slate-400 hover:border-gray-200'
                                    }`}
                            >
                                <School size={24} />
                                <span className="text-sm font-bold">Quero Ensinar</span>
                                {role === 'teacher' && <div className="absolute top-2 right-2 text-rose-500"><CheckCircle2 size={16} /></div>}
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nome completo"
                                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Seu e-mail"
                                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Crie uma senha"
                                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
                                required
                            />
                        </div>

                        {/* Termos */}
                        <div className="flex items-start gap-2 mt-2">
                            <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-rose-500 rounded border-gray-300 focus:ring-rose-500" required />
                            <label htmlFor="terms" className="text-sm text-slate-500">
                                Concordo com os <a href="#" className="text-rose-500 font-bold hover:underline">Termos de Uso</a> e <a href="#" className="text-rose-500 font-bold hover:underline">Política de Privacidade</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 mt-2 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Criando conta...' : (
                                <>
                                    Cadastrar-se Grátis <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-500">
                        Já tem uma conta? <a href="/signin" className="text-rose-500 font-bold hover:underline">Faça Login</a>
                    </p>
                </div>

                {/* --- Lado Direito: Visual/Benefícios --- */}
                <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden order-1 lg:order-2">
                    {/* Elementos Decorativos de Fundo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10 mt-10">
                        <h3 className="text-3xl font-bold mb-6 leading-snug">
                            Transforme conhecimento em <br />
                            <span className="text-rose-400">novas oportunidades.</span>
                        </h3>
                        <ul className="space-y-4 text-slate-300">
                            <li className="flex items-center gap-3">
                                <div className="p-1 bg-rose-500/20 rounded-full text-rose-400"><CheckCircle2 size={18} /></div>
                                Acesso a professores verificados
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-1 bg-rose-500/20 rounded-full text-rose-400"><CheckCircle2 size={18} /></div>
                                Agendamento flexível e fácil
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-1 bg-rose-500/20 rounded-full text-rose-400"><CheckCircle2 size={18} /></div>
                                Sala de aula virtual integrada
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-1 bg-rose-500/20 rounded-full text-rose-400"><CheckCircle2 size={18} /></div>
                                Pagamento seguro
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700">
                        <p className="italic text-slate-300 mb-4">A plataforma mudou minha carreira. Consegui alunos do país inteiro sem sair de casa.</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center font-bold">R</div>
                            <div>
                                <div className="font-bold text-white">Ricardo Mendes</div>
                                <div className="text-xs text-rose-400">Professor de Inglês</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}