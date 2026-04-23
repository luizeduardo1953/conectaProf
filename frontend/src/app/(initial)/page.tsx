'use client';

import { useEffect, useState } from 'react';
import { Search, Star, User, ShieldCheck, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SUGGEST_TAGS = ['Matemática', 'Inglês', 'Português', 'Física', 'Química', 'Programação'];

export default function Initial() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const url = process.env.NEXT_PUBLIC_URL_BACKEND;

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${url}/teachers`);
        if (res.ok) {
          const data = await res.json();
          setTeachers(data.slice(0, 4)); // Apenas 4 em destaque
        }
      } catch {
        // Silently fail — landing page ainda funciona
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, [url]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">

      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold text-slate-900">ConectaProf</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-rose-500 transition">Encontrar Professor</Link>
            <Link href="/signup?role=teacher" className="hover:text-rose-500 transition">Dar Aulas</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-medium hover:text-rose-500 transition hidden sm:block">Entrar</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
              Cadastre-se
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-white pb-16 pt-12 lg:pt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">

          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Os melhores professores <br />
              <span className="text-rose-500">Estão Aqui.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto lg:mx-0">
              Aprenda qualquer assunto, a qualquer hora. Conecte-se com especialistas verificados para aulas online ou presenciais.
            </p>

            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex-1 flex items-center px-4 h-14 w-full">
                <Search className="w-5 h-5 text-rose-500 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Matéria, assunto ou habilidade..."
                  className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto h-14 px-8 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg"
              >
                Buscar
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide pt-1">Populares:</span>
              {SUGGEST_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="text-sm text-slate-600 bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0 relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl relative overflow-hidden flex items-center justify-center border border-rose-100">
              <div className="grid grid-cols-2 gap-4 p-8 w-full">
                {[
                  { icon: BookOpen, label: 'Matemática', color: 'bg-purple-100 text-purple-600' },
                  { icon: Star, label: 'Inglês', color: 'bg-yellow-100 text-yellow-600' },
                  { icon: Search, label: 'Ciências', color: 'bg-green-100 text-green-600' },
                  { icon: User, label: 'História', color: 'bg-blue-100 text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 hover:-translate-y-1 transition duration-300">
                    <div className={`p-3 rounded-xl ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">100% Verificado</div>
                  <div className="text-xs text-slate-500">Professores qualificados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR / STATS --- */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Professores' },
            { value: '10k+', label: 'Alunos ativos' },
            { value: '50k+', label: 'Aulas realizadas' },
            { value: '4.9★', label: 'Avaliação média' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-slate-400 text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- PROFESSORES EM DESTAQUE --- */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Professores em Destaque</h2>
              <p className="text-slate-500 mt-1">Encontre o professor ideal para você.</p>
            </div>
            <Link href="/signin" className="text-rose-500 font-bold text-sm hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {loadingTeachers ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : teachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachers.map(teacher => (
                <div key={teacher.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                  <div className="relative h-48 bg-gradient-to-br from-slate-100 to-rose-50 flex items-center justify-center">
                    <User className="text-slate-300 w-16 h-16" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" /> 5.0
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition truncate">
                      {teacher.user?.name || 'Professor(a)'}
                    </h3>
                    <p className="text-sm font-bold text-rose-500 mb-2">{teacher.training || 'Diversas disciplinas'}</p>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">
                      {teacher.biography || 'Especialista disponível para aulas personalizadas.'}
                    </p>

                    {teacher.availabilities?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {teacher.availabilities.slice(0, 2).map((a: any, i: number) => (
                          <span key={i} className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                            <Clock size={9} className="inline mr-1" />
                            {daysOfWeek[a.dayWeek]}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Preço/hora</span>
                        <div className="font-bold text-slate-900 text-lg">R$ {teacher.priceHour ?? '—'}</div>
                      </div>
                      <Link href="/signin" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition">
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <User size={48} className="mx-auto mb-4 text-slate-200" />
              <p>Nenhum professor disponível no momento. Volte em breve!</p>
            </div>
          )}
        </div>
      </section>

      {/* --- BANNER CTA --- */}
      <section className="bg-rose-600 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Você é professor? Comece a dar aulas hoje</h2>
          <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
            Crie seu perfil, defina seus horários e preços, e conecte-se com alunos de todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="bg-white text-rose-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition">
              Cadastre-se como Professor
            </Link>
            <Link href="/signin" className="bg-rose-700 text-white border border-rose-500 px-8 py-3 rounded-xl font-bold hover:bg-rose-800 transition">
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-rose-500 rounded-md flex items-center justify-center text-white font-bold text-sm">C</div>
              <span className="text-white font-bold">ConectaProf</span>
            </div>
            <p className="text-sm">Conectando alunos e professores em todo o Brasil.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Plataforma</h4>
            <Link href="/signin" className="hover:text-white transition text-sm">Encontrar Professor</Link>
            <Link href="/signup" className="hover:text-white transition text-sm">Ser Professor</Link>
            <Link href="/signin" className="hover:text-white transition text-sm">Como funciona</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Conta</h4>
            <Link href="/signin" className="hover:text-white transition text-sm">Entrar</Link>
            <Link href="/signup" className="hover:text-white transition text-sm">Cadastrar</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold mb-2">Suporte</h4>
            <a href="#" className="hover:text-white transition text-sm">Central de Ajuda</a>
            <a href="#" className="hover:text-white transition text-sm">Contato</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <span>© 2025 ConectaProf. Todos os direitos reservados.</span>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Termos</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}