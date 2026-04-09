import {ArrowLeft } from 'lucide-react';

export default function Signin() {
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
                    <div className="flex items-center gap-2 cursor-pointer w-fit mb-4 hover:opacity-80 transition">
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
                    <button className="lg:hidden flex items-center text-slate-500 mb-6 hover:text-rose-500 transition">
                        <ArrowLeft size={20} className="mr-2"/> Voltar
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Faça seu Login</h2>
                            <p className="text-slate-500 text-sm mt-2">Insira seus dados para acessar a plataforma.</p>
                        </div>

                        <Signin />

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