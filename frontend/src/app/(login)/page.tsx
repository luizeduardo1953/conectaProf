'use client';

import React from 'react';
import { User, Mail, Briefcase, ChevronDown } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';

const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);

        console.log('Usuário logado com sucesso:', result);

    } catch (error) {
        console.error('Erro durante o login:', error);
    }
}

export default function Login() {
    return (
        <>
            <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#5B21B6] font-sans text-white selection:bg-teal-400 selection:text-white">

                {/* --- Elementos Decorativos de Fundo --- */}
                <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-screen animate-pulse"></div>
                <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-screen"></div>
                <div className="absolute top-20 right-0 h-64 w-32 translate-x-16 rotate-45 rounded-full bg-gradient-to-b from-teal-300 to-blue-500 opacity-10"></div>
                <div className="absolute bottom-10 left-0 h-96 w-48 -translate-x-16 -rotate-45 rounded-full bg-gradient-to-t from-purple-400 to-pink-500 opacity-10"></div>

                {/* --- Container Principal --- */}
                <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 lg:px-8">

                    {/* --- Header --- */}
                    <header className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-teal-400 to-blue-500">
                                <div className="h-3 w-3 rounded-full bg-white"></div>
                            </div>
                            <span className="text-xl font-bold tracking-wide">Conecta Prof</span>
                        </div>

                        <nav className="hidden items-center gap-8 md:flex">
                            <a href="#" className="text-sm font-medium text-gray-200 hover:text-white transition">Perguntas frequentes</a>
                            <a href="#" className="text-sm font-medium text-gray-200 hover:text-white transition">Contato</a>
                            <button className="rounded px-5 py-2 text-sm font-bold text-teal-300 transition hover:bg-white/10 border border-teal-500/30">
                                Quero aprender
                            </button>
                        </nav>
                    </header>

                    {/* --- Conteúdo Principal --- */}
                    <main className="mt-10 grid grid-cols-1 items-center gap-12 lg:mt-20 lg:grid-cols-2">

                        {/* Lado Esquerdo: Texto Promocional */}
                        <div className="flex flex-col gap-6">
                            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                Professor, encontre <br />
                                seus alunos de forma <br />
                                simples e rápida.
                            </h1>
                            <p className="max-w-md text-lg text-gray-300">
                                Conectamos profissionais aos alunos de uma forma fácil e segura.
                            </p>

                        </div>

                        {/* Lado Direito: Formulário de Cadastro */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
                                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                                    Hey professor, faça o <br /> seu cadastro.
                                </h2>

                                <form className="flex flex-col gap-4">
                                    {/* Inputs */}
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="text" placeholder="Seu nome" className="w-full rounded bg-gray-100 p-3 pl-10 text-gray-700 outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                    </div>

                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="email" placeholder="Email" className="w-full rounded bg-gray-100 p-3 pl-10 text-gray-700 outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                    </div>

                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Briefcase className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full appearance-none rounded bg-gray-100 p-3 pl-10 text-gray-500 outline-none focus:ring-2 focus:ring-teal-400 transition cursor-pointer" defaultValue="">
                                            <option value="" disabled>Especialidade</option>
                                            <option value="matematica">Matemática</option>
                                            <option value="portugues">Português</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <button type="submit" className="mt-2 w-full rounded bg-[#2DD4BF] py-3 font-bold text-white shadow-lg shadow-teal-400/30 transition hover:bg-[#14B8A6] hover:shadow-teal-400/50">
                                        Quero ensinar
                                    </button>
                                </form>

                                {/* --- Divisor --- */}
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500">ou continue com</span>
                                    </div>
                                </div>

                                {/* --- Botão Google --- */}
                                <button onClick={loginWithGoogle} className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition hover:bg-gray-50 hover:shadow-sm">
                                    {/* SVG Logo do Google */}
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    <span className="font-semibold">Google</span>
                                </button>

                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </>
    )
}