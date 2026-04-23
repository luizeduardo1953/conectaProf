'use client';

import { useState } from "react";
import { Mail, Lock, User, GraduationCap, School, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupForm() {
  const auth = useAuth();

  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Parâmetros na ordem correta: name, email, password, role
    await auth.signup(name, email, password, role);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Erro inline */}
      {auth.error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{auth.error}</span>
        </div>
      )}

      {/* Seletor de Perfil */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <button
          type="button"
          id="role-student"
          onClick={() => setRole('student')}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 relative ${role === 'student'
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
          id="role-teacher"
          onClick={() => setRole('teacher')}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 relative ${role === 'teacher'
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
          id="signup-name"
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
          id="signup-email"
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
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha (mín. 8 caracteres)"
          className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium"
          minLength={8}
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
        id="signup-submit"
        type="submit"
        disabled={auth.loading}
        className="w-full rounded-xl bg-slate-900 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-70 mt-2 flex items-center justify-center gap-2"
      >
        {auth.loading ? 'Criando conta...' : (
          <>
            Cadastrar-se Grátis <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}