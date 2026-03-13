# ConectaProf

> Plataforma para conectar estudantes a professores particulares, facilitando a busca, agendamento e gestão de aulas particulares.

---

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Banco de Dados](#banco-de-dados)
- [Como Executar](#como-executar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)

---

## Sobre o Projeto

O **ConectaProf** é uma plataforma web full-stack que conecta estudantes a professores particulares. Estudantes podem pesquisar professores por disciplina, visualizar perfis, disponibilidades e valores por hora, e realizar agendamentos de aulas. Professores podem gerenciar seu perfil, disciplinas e disponibilidade de horários.

---

## Funcionalidades

- **Autenticação** — Cadastro e login com JWT
- **Perfis de Usuário** — Gerenciamento de conta com foto de avatar
- **Catálogo de Professores** — Listagem de professores com filtros
- **Agendamento de Aulas** — Criação de agendamentos
- **Disponibilidade** — Professores cadastram seus horários disponíveis por dia da semana
- **Disciplinas** — Cadastro e associação de disciplinas a professores
- **Painel do Aluno** — Dashboard com histórico e status dos agendamentos

---

## Tecnologias

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| [NestJS](https://nestjs.com/) | ^11 | Framework principal da API REST |
| [Prisma ORM](https://www.prisma.io/) | ^7 | Acesso ao banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | 16 | Banco de dados relacional |
| [JWT](https://jwt.io/) | — | Autenticação stateless |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | ^6 | Hash de senhas |
| [TypeScript](https://www.typescriptlang.org/) | ^5.7 | Tipagem estática |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16 | Framework React com SSR/SSG |
| [React](https://react.dev/) | 19 | Biblioteca de UI |
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | Estilização utilitária |
| [Lucide React](https://lucide.dev/) | ^0.575 | Ícones |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Tipagem estática |

### Infraestrutura
- **Docker & Docker Compose** — Orquestração dos serviços (backend, frontend e banco)

---

## Arquitetura

O projeto segue uma estrutura **monorepo** com separação clara entre `backend` e `frontend`.

```
ConectaProf/
├── backend/          # API REST (NestJS)
│   ├── src/
│   │   ├── auth/         # Autenticação e guards JWT
│   │   ├── users/        # Módulo de usuários (domain, application, infra)
│   │   ├── teachers/     # Módulo de professores
│   │   ├── discipline/   # Módulo de disciplinas
│   │   ├── scheduling/   # Módulo de agendamentos
│   │   └── prisma/       # Serviço do Prisma
│   └── prisma/
│       └── schema.prisma # Schema do banco de dados
│
├── frontend/         # Aplicação web (Next.js)
│   └── src/
│       ├── app/          # Rotas (App Router)
│       │   ├── signin/       # Página de login
│       │   ├── signup/       # Página de cadastro
│       │   ├── dashboard/    # Painel do usuário
│       │   ├── profile/      # Perfil do usuário
│       │   └── teachers/     # Listagem de professores
│       ├── components/   # Componentes reutilizáveis
│       ├── services/     # Chamadas à API
│       └── lib/          # Utilitários e configurações
│
└── docker-compose.yml
```

O backend adota **Arquitetura em Camadas** (Domain, Application, Infrastructure) inspirada nos princípios de Clean Architecture.

---

## Banco de Dados

O schema inclui as seguintes entidades principais:

| Modelo | Descrição |
|---|---|
| `User` | Usuário da plataforma (aluno, professor ou admin) |
| `Teacher` | Perfil estendido do professor (biografia, formação, preço/hora) |
| `Discipline` | Disciplinas disponíveis na plataforma |
| `TeacherDiscipline` | Relação N:N entre professores e disciplinas |
| `Availability` | Horários disponíveis dos professores (por dia da semana) |
| `Scheduling` | Agendamentos de aulas entre alunos e professores |

**Roles de usuário:** `student` | `teacher` | `admin`

---

## Como Executar

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose instalados
- **OU** Node.js 20+ e PostgreSQL instalados localmente

### Com Docker (recomendado)

```bash
# Clone o repositório
git clone https://github.com/luizeduardo1953/conectaProf.git
cd ConectaProf

# Suba todos os serviços
docker-compose up --build
```

Os serviços estarão disponíveis em:
- **Frontend:** http://localhost:3000
- **Backend (API):** http://localhost:8000
- **PostgreSQL:** localhost:5433

### Sem Docker (desenvolvimento local)

**Backend:**
```bash
cd backend
npm install

# Configure o arquivo .env (veja a seção de variáveis de ambiente)

# Execute as migrations do banco
npm run prisma:migrate

# Inicie em modo desenvolvimento
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install

# Configure o arquivo .env
npm run dev
```

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

```env
# Banco de dados
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/conectaprof"

# JWT
JWT_SECRET="sua_chave_secreta"
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Scripts Disponíveis

### Backend

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento com hot-reload |
| `npm run start:prod` | Inicia o build de produção |
| `npm run build` | Compila o projeto |
| `npm run test` | Executa os testes unitários |
| `npm run test:e2e` | Executa os testes end-to-end |
| `npm run test:cov` | Gera relatório de cobertura de testes |
| `npm run prisma:migrate` | Executa as migrations do banco |
| `npm run prisma:studio` | Abre o Prisma Studio (interface visual do banco) |
| `npm run prisma:generate` | Gera o Prisma Client |

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter |

---

## Licença

Este projeto está sob a licença **UNLICENSED** — uso privado.
