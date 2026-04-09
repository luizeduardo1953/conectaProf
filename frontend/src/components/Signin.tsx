import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Signin() {

    const auth = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await auth.signin(email, password);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
    )
}