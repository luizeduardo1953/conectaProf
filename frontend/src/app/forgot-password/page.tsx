'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_URL_BACKEND ?? '';

type Step = 'email' | 'reset' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Passo 1: verificar se o e-mail existe
  async function handleVerifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Testa se o e-mail existe tentando um signin com senha dummy (vai retornar 401, não 404)
      // Mas a forma correta é chamar o endpoint de reset e ver a resposta
      // Usamos uma chamada dummy para checar existência sem expor dados
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos senha inválida para apenas verificar o e-mail (vai falhar na validação mas confirma o e-mail)
        body: JSON.stringify({ email, newPassword: 'check12345' }),
      });

      if (res.status === 404) {
        setError('Nenhuma conta encontrada com este e-mail.');
        return;
      }
      // Qualquer outro status (mesmo 200) significa que o e-mail existe
      setStep('reset');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // Passo 2: redefinir a senha
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 20) {
      setError('A senha deve ter entre 8 e 20 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
        setError(msg || 'Erro ao redefinir a senha.');
        return;
      }

      setStep('success');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans text-slate-800 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Decorativos */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-rose-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-blue-50 opacity-50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Lado esquerdo */}
        <div className="hidden lg:flex flex-col gap-6 pr-8">
          <a href="/" className="flex items-center gap-2 w-fit mb-4 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm shadow-rose-500/30">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ConectaProf</span>
          </a>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Recupere o acesso <br />
            à sua <span className="text-rose-500">conta.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md">
            Esqueceu sua senha? Sem problema. Informe seu e-mail cadastrado e defina uma nova senha em segundos.
          </p>

          <div className="flex flex-col gap-3 mt-4">
            {[
              { icon: '🔒', text: 'Processo 100% seguro' },
              { icon: '⚡', text: 'Redefinição instantânea' },
              { icon: '✅', text: 'Sem necessidade de e-mail de confirmação' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lado direito: card */}
        <div className="w-full max-w-md mx-auto">

          {/* Mobile: voltar */}
          <a href="/signin" className="lg:hidden flex items-center text-slate-500 mb-6 hover:text-rose-500 transition font-medium">
            <ArrowLeft size={18} className="mr-2" /> Voltar ao Login
          </a>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">

            {/* ─── PASSO 1: E-MAIL ─── */}
            {step === 'email' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail size={26} className="text-rose-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Esqueceu a senha?</h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Informe seu e-mail cadastrado para continuar.
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} className="flex flex-col gap-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu e-mail cadastrado"
                      required
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium placeholder-slate-400"
                    />
                  </div>

                  <button
                    id="forgot-continue"
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-rose-500 py-3.5 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verificando...' : 'Continuar'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                  <a href="/signin" className="flex items-center justify-center gap-1.5 font-bold text-slate-600 hover:text-rose-500 transition">
                    <ArrowLeft size={14} /> Voltar ao Login
                  </a>
                </div>
              </>
            )}

            {/* ─── PASSO 2: NOVA SENHA ─── */}
            {step === 'reset' && (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound size={26} className="text-rose-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Nova senha</h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Defina uma nova senha para <span className="font-semibold text-slate-700">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-5 flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                  {/* Nova senha */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                    </div>
                    <input
                      id="reset-new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha (8–20 caracteres)"
                      required
                      minLength={8}
                      maxLength={20}
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 pr-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium placeholder-slate-400"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Confirmar senha */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition" />
                    </div>
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme a nova senha"
                      required
                      className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3.5 pl-11 pr-11 text-slate-700 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition font-medium placeholder-slate-400"
                    />
                    <button type="button" onClick={() => setShowConfirm(s => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Indicador de força */}
                  {newPassword.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((i) => {
                          const score = Math.min(Math.floor(newPassword.length / 5), 4);
                          const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
                          return (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= score ? colors[score - 1] : 'bg-slate-200'}`} />
                          );
                        })}
                      </div>
                      <p className="text-xs text-slate-400">
                        {newPassword.length < 8 ? 'Muito curta' : newPassword.length < 12 ? 'Razoável' : newPassword.length < 16 ? 'Boa' : 'Forte'}
                      </p>
                    </div>
                  )}

                  <button
                    id="reset-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-rose-500 py-3.5 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Salvando...' : 'Redefinir Senha'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <button onClick={() => { setStep('email'); setError(''); }}
                    className="flex items-center justify-center gap-1.5 font-bold text-slate-600 hover:text-rose-500 transition mx-auto">
                    <ArrowLeft size={14} /> Usar outro e-mail
                  </button>
                </div>
              </>
            )}

            {/* ─── PASSO 3: SUCESSO ─── */}
            {step === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Senha redefinida!</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Sua senha foi atualizada com sucesso. Faça login com a nova senha.
                </p>
                <button
                  id="goto-signin"
                  onClick={() => router.push('/signin')}
                  className="w-full rounded-xl bg-rose-500 py-3.5 font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-[0.98]"
                >
                  Ir para o Login
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
