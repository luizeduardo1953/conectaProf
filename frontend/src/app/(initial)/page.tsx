'use client';

import { Search, MapPin, Star, User, BookOpen, ShieldCheck, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Initial() {

  const router = useRouter();

    return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="text-xl font-bold text-slate-900">ConectaProf</span>
          </div>
          
          {/* Nav Links */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <span className="hover:text-rose-500 cursor-pointer">Encontrar Professor</span>
            <span className="hover:text-rose-500 cursor-pointer">Dar Aulas</span>
            <span className="hover:text-rose-500 cursor-pointer">Sobre</span>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <a onClick={() => router.push('/login')} className="text-sm font-medium hover:text-rose-500 cursor-pointer hidden sm:block">Entrar</a>
            <button onClick={() => router.push('/register')} className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
              Cadastre-se
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION (Foco na Busca) --- */}
      <section className="relative bg-white pb-16 pt-12 lg:pt-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Texto Principal e Busca */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Os melhores professores <br /> 
              <span className="text-rose-500">Estão Aqui.</span>
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto lg:mx-0">
              Aprenda qualquer assunto, a qualquer hora. Conecte-se com especialistas verificados para aulas online ou presenciais.
            </p>

            {/* Componente de Busca Híbrido */}
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex-1 flex items-center px-4 h-14 w-full bg-gray-50 rounded-xl sm:bg-transparent border border-gray-100 sm:border-none mb-2 sm:mb-0">
                <Search className="w-5 h-5 text-rose-500 mr-3" />
                <input 
                  type="text" 
                  placeholder="Matéria, assunto ou habilidade..." 
                  className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="flex-1 flex items-center px-4 h-14 w-full bg-gray-50 rounded-xl sm:bg-transparent border border-gray-100 sm:border-none">
                <MapPin className="w-5 h-5 text-rose-500 mr-3" />
                <input 
                  type="text" 
                  placeholder="Localização ou Online" 
                  className="bg-transparent w-full outline-none text-slate-700 placeholder-slate-400 font-medium"
                />
              </div>
              <button className="w-full sm:w-auto h-14 px-8 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg mt-2 sm:mt-0">
                Buscar
              </button>
            </div>
            
            {/* Tags de Sugestão */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide pt-1">Populares:</span>
              {[1, 2, 3].map((tag) => (
                <span key={tag} className="text-sm text-slate-600 bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition">
                  Categoria {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Área Visual (Placeholder para Imagem Hero) */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0 relative">
            <div className="aspect-[4/3] bg-gray-100 rounded-3xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
               <span className="text-gray-400 font-medium flex flex-col items-center gap-2">
                 <User size={48} />
                 Imagem Hero / Banner Promocional
               </span>
               
               {/* Floating Card Element (Decoração) */}
               <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow">
                 <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <ShieldCheck size={20} />
                 </div>
                 <div>
                   <div className="text-sm font-bold text-slate-800">100% Verificado</div>
                   <div className="text-xs text-slate-500">Badge de Confiança</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST BAR / STATS --- */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800/50">
            {[1, 2, 3, 4].map((stat) => (
                <div key={stat} className="flex flex-col items-center">
                    <span className="text-2xl md:text-3xl font-bold text-white mb-1">000+</span>
                    <span className="text-slate-400 text-sm font-medium">Métrica Chave</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- GRID DE CATEGORIAS --- */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Navegar por Assunto</h2>
            <a href="#" className="text-rose-500 font-bold text-sm hover:underline">Ver todos</a>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((cat) => (
                <div key={cat} className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition cursor-pointer flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition">
                        <BookOpen size={20} />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Matéria {cat}</span>
                </div>
            ))}
        </div>
      </section>

      {/* --- GRID DE CARDS (LISTAGEM) --- */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Professores em Destaque</h2>
            <p className="text-slate-500 mb-8">Seleção baseada em avaliações e desempenho recente.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Loop para gerar 4 cards de exemplo */}
                {[1, 2, 3, 4].map((card) => (
                    <div key={card} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                        
                        {/* Header do Card (Imagem/Avatar) */}
                        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                            <User className="text-gray-300 w-16 h-16" />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                <Star size={12} className="text-yellow-400 fill-yellow-400" /> 5.0
                            </div>
                            <button className="absolute top-3 left-3 p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-rose-500 transition">
                                <Heart size={16} />
                            </button>
                        </div>

                        {/* Corpo do Card */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition truncate">Nome do Prof.</h3>
                            </div>
                            
                            <p className="text-sm font-bold text-rose-500 mb-2">Disciplina / Especialidade</p>
                            
                            <p className="text-slate-500 text-xs line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg">
                                Breve descrição do professor ou metodologia aplicada nas aulas...
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-2 py-0.5 rounded">Tag 1</span>
                                <span className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-2 py-0.5 rounded">Tag 2</span>
                            </div>

                            {/* Footer do Card */}
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400">Preço/hora</span>
                                    <span className="font-bold text-slate-900 text-lg">R$ 00</span>
                                </div>
                                <button className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-rose-500 transition">
                                    Ver perfil
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-10 text-center">
                <button className="px-8 py-3 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-slate-900 transition">
                    Carregar mais resultados
                </button>
            </div>
        </div>
      </section>

      {/* --- BANNER CTA --- */}
      <section className="bg-rose-600 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Título do Call-to-Action</h2>
            <p className="text-rose-100 mb-8 max-w-2xl mx-auto">
                Texto convidativo para o usuário realizar a ação principal da plataforma (ex: tornar-se professor ou começar a aprender).
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-rose-600 px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition">
                    Botão Principal
                </button>
                <button className="bg-rose-700 text-white border border-rose-500 px-8 py-3 rounded-xl font-bold hover:bg-rose-800 transition">
                    Botão Secundário
                </button>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Colunas de Links Placeholder */}
            {[1, 2, 3, 4].map((col) => (
                <div key={col} className="flex flex-col gap-3">
                    <h4 className="text-white font-bold mb-2">Coluna {col}</h4>
                    <a href="#" className="hover:text-white transition text-sm">Link do Rodapé</a>
                    <a href="#" className="hover:text-white transition text-sm">Link do Rodapé</a>
                    <a href="#" className="hover:text-white transition text-sm">Link do Rodapé</a>
                </div>
            ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <span>© 2024 Nome da Empresa. Todos os direitos reservados.</span>
            <div className="flex gap-4 mt-4 md:mt-0">
                <span>Termos</span>
                <span>Privacidade</span>
            </div>
        </div>
      </footer>
    </div>
  );
}