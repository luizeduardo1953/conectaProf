# Documentação de Rotas API - ConectaProf

Esta documentação detalha todos os endpoints disponíveis no backend do ConectaProf, seus requisitos de autenticação e papéis necessários.

## Sumário
- [Autenticação](#autenticação)
- [Usuários](#usuários)
- [Professores](#professores)
- [Agendamentos](#agendamentos)
- [Disciplinas](#disciplinas)
- [Disponibilidade](#disponibilidade)

---

## Autenticação
Base URL: `/auth`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/auth/signin` | Sim | Todos | Realiza login e retorna o token JWT. |
| `POST` | `/auth/signup` | Sim | Todos | Cria um novo usuário básico (Estudante ou Professor). |

---

## Usuários
Base URL: `/users`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/users` | Não | `admin` | Retorna todos os usuários cadastrados. |
| `GET` | `/users/me` | Não | Todos | Retorna os dados do usuário autenticado (através do token). |
| `GET` | `/users/email/:email` | Não | `admin` | Busca um usuário específico pelo e-mail. |
| `GET` | `/users/:id` | Não | `admin` | Busca um usuário específico pelo ID (UUID). |
| `PUT` | `/users/:id` | Não | `owner` / `admin` | Atualiza dados do perfil. (Dono do perfil ou Admin). |
| `DELETE` | `/users/:id` | Não | `admin` | Remove um usuário do sistema. |

---

## Professores
Base URL: `/teachers`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/teachers` | Sim | Todos | Retorna a listagem de todos os professores cadastrados. |
| `GET` | `/teachers/:id` | Não | Todos | Retorna os detalhes de um professor pelo ID. |
| `POST` | `/teachers` | Não | `teacher` / `admin` | Cria o perfil detalhado de um professor (biografia, preço, etc). |
| `PUT` | `/teachers/:id` | Não | `owner` / `admin` | Atualiza os dados do perfil de professor. |
| `DELETE` | `/teachers/:id` | Não | `owner` / `admin` | Remove o perfil de professor (mantém o usuário). |

---

## Agendamentos
Base URL: `/scheduling`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `POST` | `/scheduling` | Não | `student` | Estudante solicita um novo agendamento com um professor. |
| `GET` | `/scheduling` | Não | `admin` | Lista todos os agendamentos do sistema. |
| `GET` | `/scheduling/my-classes` | Não | `teacher` | Retorna as aulas agendadas para o professor autenticado. |
| `GET` | `/scheduling/my-scheduling` | Não | `student` | Retorna os agendamentos feitos pelo estudante autenticado. |
| `GET` | `/scheduling/teacher/:id` | Não | `admin` | Lista agendamentos de um professor específico. |
| `GET` | `/scheduling/student/:id` | Não | `admin` | Lista agendamentos de um estudante específico. |
| `GET` | `/scheduling/discipline/:id` | Não | `admin` | Lista agendamentos por disciplina. |
| `GET` | `/scheduling/:id` | Não | `admin` | Detalhes de um agendamento específico. |
| `DELETE` | `/scheduling/:id` | Não | `owner`/`student`/`teacher`/`admin` | Cancela/Remove um agendamento (Participantes ou Admin). |

---

## Disciplinas
Base URL: `/discipline`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/discipline` | Não | `admin` | Lista todas as disciplinas cadastradas. |
| `GET` | `/discipline/:name` | Não | `student` / `teacher` | Busca detalhes de uma disciplina pelo nome. |
| `POST` | `/discipline` | Não | `admin` | Cria uma nova disciplina no sistema. |
| `PUT` | `/discipline` | Não | `admin` | Atualiza o nome de uma disciplina. |
| `DELETE` | `/discipline/:name` | Não | `admin` | Remove uma disciplina. |

---

## Disponibilidade
Base URL: `/availability`

| Método | Rota | Público | Papel | Descrição |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/availability` | Não | `teacher` / `admin` | Lista todas as grades de disponibilidade. |
| `GET` | `/availability/:id` | Não | `teacher` / `admin` | Busca uma disponibilidade específica pelo ID. |
| `POST` | `/availability` | Não | `teacher` / `admin` | Cria um novo horário de disponibilidade para um professor. |
| `PUT` | `/availability/:id` | Não | `teacher` / `admin` | Atualiza um horário de disponibilidade existente. |
| `DELETE` | `/availability/:id` | Não | `teacher` / `admin` | Remove um horário de disponibilidade. |

---

> [!NOTE]
> Rotas marcadas como **Não Públicas** exigem o envio do token JWT no header `Authorization` como `Bearer <token>`.
