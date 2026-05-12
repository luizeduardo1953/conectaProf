'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users, GraduationCap, Calendar, Trash2, Shield,
  LogOut, RefreshCw, ChevronDown, X, CheckCircle2,
  AlertCircle, BarChart3, Sparkles, Edit2, Save, UserCog
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_URL_BACKEND ?? '';

function authHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

function Avatar({ src, name, size = 36 }: { src?: string; name?: string; size?: number }) {
  const initials = (name ?? '?').charAt(0).toUpperCase();
  if (src) {
    return (
      <img
        src={`${BACKEND_URL}${src}`}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover border-2 border-white shadow-sm"
        style={{ width: size, height: size }}
        onError={(e: any) => { e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center text-white font-black border-2 border-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = { admin: 'Admin', teacher: 'Professor', student: 'Aluno' };
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
  teacher: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  student: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'dashboard' | 'users' | 'teachers' | 'schedulings'>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [schedulings, setSchedulings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const notify = (type: 'ok' | 'err', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  async function loadAll() {
    setLoading(true);
    try {
      const me = await fetch(`${BACKEND_URL}/users/me`, { headers: authHeader() });
      if (!me.ok) { router.push('/signin'); return; }
      const meData = await me.json();
      if (meData.role !== 'admin') { router.push('/dashboard'); return; }
      setCurrentUser(meData);

      const [st, us, tc, sc] = await Promise.all([
        fetch(`${BACKEND_URL}/admin/stats`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${BACKEND_URL}/admin/users`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${BACKEND_URL}/admin/teachers`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${BACKEND_URL}/admin/schedulings`, { headers: authHeader() }).then(r => r.json()),
      ]);
      setStats(st); setUsers(Array.isArray(us) ? us : []); setTeachers(Array.isArray(tc) ? tc : []); setSchedulings(Array.isArray(sc) ? sc : []);
    } catch { router.push('/signin'); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadAll(); }, []);

  async function deleteUser(id: string, name: string) {
    if (!confirm(`Excluir usuário "${name}"? Esta ação é irreversível.`)) return;
    const r = await fetch(`${BACKEND_URL}/admin/users/${id}`, { method: 'DELETE', headers: authHeader() });
    if (r.ok) { setUsers(u => u.filter(x => x.id !== id)); notify('ok', 'Usuário excluído.'); }
    else notify('err', 'Erro ao excluir usuário.');
  }

  async function deleteTeacher(id: string) {
    if (!confirm('Excluir perfil de professor?')) return;
    const r = await fetch(`${BACKEND_URL}/admin/teachers/${id}`, { method: 'DELETE', headers: authHeader() });
    if (r.ok) { setTeachers(t => t.filter(x => x.id !== id)); notify('ok', 'Professor excluído.'); }
    else notify('err', 'Erro ao excluir professor.');
  }

  async function deleteScheduling(id: string) {
    if (!confirm('Cancelar este agendamento?')) return;
    const r = await fetch(`${BACKEND_URL}/admin/schedulings/${id}`, { method: 'DELETE', headers: authHeader() });
    if (r.ok) { setSchedulings(s => s.filter(x => x.id !== id)); notify('ok', 'Agendamento cancelado.'); }
    else notify('err', 'Erro ao cancelar agendamento.');
  }

  async function saveUser() {
    if (!editingUser) return;
    setSaving(true);
    const r = await fetch(`${BACKEND_URL}/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ name: editName, role: editRole }),
    });
    if (r.ok) {
      const updated = await r.json();
      setUsers(u => u.map(x => x.id === updated.id ? updated : x));
      setEditingUser(null);
      notify('ok', 'Usuário atualizado!');
    } else notify('err', 'Erro ao atualizar usuário.');
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: `Usuários (${users.length})`, icon: Users },
    { id: 'teachers', label: `Professores (${teachers.length})`, icon: GraduationCap },
    { id: 'schedulings', label: `Agendamentos (${schedulings.length})`, icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-purple-700/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-rose-700/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-rose-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white tracking-tight">ConectaProf</span>
                <span className="text-xs font-bold bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">Admin</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{currentUser?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} title="Recarregar dados"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700">
              <RefreshCw size={16} />
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition-all border border-slate-700">
              <Sparkles size={14} /> Plataforma
            </button>
            <button onClick={() => { localStorage.removeItem('token'); router.push('/signin'); }}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Notification */}
        {msg && (
          <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl text-sm font-semibold backdrop-blur-md transition-all ${msg.type === 'ok' ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' : 'bg-red-950/90 border-red-500/30 text-red-300'}`}>
            {msg.type === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {msg.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-2xl mb-8 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${tab === id ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === 'dashboard' && stats && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-1">Visão Geral da Plataforma</h1>
              <p className="text-slate-400 text-sm">Estatísticas em tempo real do ConectaProf.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total de Usuários', value: stats.totalUsers, icon: Users, color: 'from-purple-600 to-purple-400' },
                { label: 'Alunos', value: stats.totalStudents, icon: Users, color: 'from-blue-600 to-blue-400' },
                { label: 'Professores', value: stats.totalTeachers, icon: GraduationCap, color: 'from-emerald-600 to-emerald-400' },
                { label: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'from-rose-600 to-rose-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white">{value}</p>
                    <p className="text-xs text-slate-400 font-medium">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Perfis de Professor', value: stats.totalTeacherProfiles, color: 'border-emerald-500/30' },
                { label: 'Total de Agendamentos', value: stats.totalSchedulings, color: 'border-blue-500/30' },
                { label: 'Agendamentos Pendentes', value: stats.pendingSchedulings, color: 'border-amber-500/30' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`bg-slate-900 border ${color} rounded-2xl p-5`}>
                  <p className="text-3xl font-extrabold text-white">{value}</p>
                  <p className="text-sm text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">Gerenciar Usuários</h2>
            <div className="space-y-2">
              {users.map((u: any) => (
                <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={u.avatarUrl} name={u.name} size={44} />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{u.name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role] ?? 'bg-slate-700 text-slate-300'}`}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                    <button onClick={() => { setEditingUser(u); setEditName(u.name); setEditRole(u.role); }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 border border-slate-700 transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteUser(u.id, u.name)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEACHERS TAB */}
        {tab === 'teachers' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">Gerenciar Professores</h2>
            <div className="space-y-2">
              {teachers.map((t: any) => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={t.user?.avatarUrl} name={t.user?.name} size={44} />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm truncate">{t.user?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400 truncate">{t.training ?? 'Sem formação'} · {t.location ?? 'Sem localização'}</p>
                      <p className="text-xs text-emerald-400 font-semibold">R$ {t.priceHour ?? '—'}/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-slate-400">{t.disciplines?.length ?? 0} disciplina(s)</span>
                    <button onClick={() => deleteTeacher(t.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULINGS TAB */}
        {tab === 'schedulings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-white">Gerenciar Agendamentos</h2>
            <div className="space-y-2">
              {schedulings.map((s: any) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-white text-sm">
                      {s.teacher?.user?.name ?? 'Professor'} → {s.student?.name ?? 'Aluno'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {s.dateHourStart ? new Date(s.dateHourStart).toLocaleString('pt-BR') : '—'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{s.discipline?.name ?? ''} · {s.observation}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                      {s.status === 'pending' ? 'Pendente' : 'Confirmado'}
                    </span>
                    <button onClick={() => deleteScheduling(s.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2"><UserCog size={20} className="text-purple-400" /> Editar Usuário</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-3 mb-6 p-4 bg-slate-800 rounded-2xl">
              <Avatar src={editingUser.avatarUrl} name={editingUser.name} size={48} />
              <div>
                <p className="font-bold text-white">{editingUser.name}</p>
                <p className="text-sm text-slate-400">{editingUser.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="mt-1.5 w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role</label>
                <div className="relative mt-1.5">
                  <select value={editRole} onChange={e => setEditRole(e.target.value)}
                    className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all">
                    <option value="student">Aluno</option>
                    <option value="teacher">Professor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingUser(null)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all border border-slate-700">
                Cancelar
              </button>
              <button onClick={saveUser} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:opacity-90 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60">
                <Save size={15} /> {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
