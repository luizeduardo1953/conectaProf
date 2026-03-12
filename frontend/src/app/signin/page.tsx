'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try{
            const url = process.env.NEXT_PUBLIC_URL_BACKEND;
            const response = await fetch(`${url}/auth/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.message || 'Erro no login');

                return;
            }

            const data = await response.json();

            localStorage.setItem('token', data.token);

            router.push('/dashboard');

        } catch(error) {
            alert('Erro na conexão');
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 font-sans text-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* --- Elementos Decorativos Sutis (Combinando com a Home) --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-rose-100 opacity-50 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
            </div>

            {/* --- Container Principal --- */}
            <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* --- Lado Esquerdo: Texto Promocional (Estilo Hero) --- */}
                <div className="hidden lg:flex flex-col gap-6 pr-8">
                    <div onClick={() => router.push('/')} className="flex items-center gap-2 cursor-pointer w-fit mb-4 hover:opacity-80 transition">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-xl font-bold text-slate-900">ConectaProf</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        Bem-vindo de volta <br />
                        ao <span className="text-rose-500">aprendizado.</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-md">
                        Gerencie suas aulas, conecte-se com novos alunos e expanda seu conhecimento em um só lugar.
                    </p>
                    
                    {/* Badge de Confiança (Visual da Home) */}
                    <div className="mt-4 flex items-center gap-4 text-sm font-medium text-slate-600 bg-white w-fit px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">User</div>
                            ))}
                        </div>
                        <p>Junte-se a +50.000 usuários</p>
                    </div>
                </div>

                {/* --- Lado Direito: Card de Login --- */}
                <div className="w-full max-w-md mx-auto">
                    {/* Botão Voltar Mobile */}
                    <button onClick={() => router.push('/')} className="lg:hidden flex items-center text-slate-500 mb-6 hover:text-rose-500 transition">
                        <ArrowLeft size={20} className="mr-2"/> Voltar
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Faça seu Login</h2>
                            <p className="text-slate-500 text-sm mt-2">Insira seus dados para acessar a plataforma.</p>
                        </div>

                        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
                            {/* Input Email */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                                </div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Seu e-mail" 
                                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium placeholder-slate-400" 
                                    required
                                />
                            </div>

                            {/* Input Senha */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                                </div>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha" 
                                    className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium placeholder-slate-400" 
                                    required
                                />
                            </div>

                            <div className="flex justify-end">
                                <a href="#" className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            {/* Botão Principal */}
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full rounded-xl bg-rose-500 py-3.5 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 hover:shadow-rose-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Entrando...' : 'Entrar na conta'}
                            </button>
                        </form>

                        {/* Divisor */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                        </div>

                        <div className="mt-8 text-center text-sm text-slate-500">
                            Não tem uma conta?{' '}
                            <a href="/signup" className="font-bold text-rose-500 hover:text-rose-600 hover:underline">
                                Cadastre-se gratuitamente
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}