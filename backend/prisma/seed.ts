import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, SchedulingStatus } from "@prisma/client";
import bcrypt from "bcrypt";

// Remove parâmetros específicos do Prisma que o pg.Pool não entende
const rawUrl = process.env.DATABASE_URL ?? '';
const connectionString = rawUrl.replace(/\?schema=[^&]+(&|$)/, '').replace(/&schema=[^&]+/, '');

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────
// Dados dos professores extras para seed
// ─────────────────────────────────────────
const teachersData = [
  {
    email: "teacher@teacher.com",
    name: "Carlos Mendes",
    biography: "Sou professor de matemática e física há mais de 10 anos. Formado pela USP com especialização em ensino médio e pré-vestibular. Já ajudei centenas de alunos a atingirem suas metas acadêmicas.",
    training: "Bacharelado em Matemática (USP)",
    priceHour: 50.0,
    telephone: "11999999999",
    location: "São Paulo, SP",
    disciplines: ["Matemática", "Física"],
    availabilities: [
      { dayWeek: 1, start: "08:00", end: "12:00" },
      { dayWeek: 3, start: "14:00", end: "18:00" },
    ],
  },
  {
    email: "ana.oliveira@teacher.com",
    name: "Ana Oliveira",
    biography: "Professora de Português e Literatura com paixão pelo ensino criativo. Minha abordagem é contextualizada e dinâmica, conectando a língua à realidade dos alunos.",
    training: "Licenciatura em Letras (UNICAMP)",
    priceHour: 70.0,
    telephone: "11988887777",
    location: "Campinas, SP",
    disciplines: ["Português", "Literatura"],
    availabilities: [
      { dayWeek: 2, start: "09:00", end: "13:00" },
      { dayWeek: 4, start: "15:00", end: "19:00" },
    ],
  },
  {
    email: "rafael.costa@teacher.com",
    name: "Rafael Costa",
    biography: "Especialista em Química e Biologia com foco em preparação para o ENEM e vestibulares. Utilizo mapas mentais e exercícios práticos para fixar o conteúdo.",
    training: "Bacharelado em Química (UFRJ)",
    priceHour: 90.0,
    telephone: "21977776666",
    location: "Rio de Janeiro, RJ",
    disciplines: ["Química", "Biologia"],
    availabilities: [
      { dayWeek: 1, start: "14:00", end: "18:00" },
      { dayWeek: 5, start: "08:00", end: "12:00" },
    ],
  },
  {
    email: "fernanda.lima@teacher.com",
    name: "Fernanda Lima",
    biography: "Professora de inglês há 8 anos com foco em conversação e preparação para exames de proficiência (TOEFL, IELTS). Formada nos EUA pela University of California.",
    training: "Letras Inglês — University of California (EUA)",
    priceHour: 120.0,
    telephone: "11966665555",
    location: "São Paulo, SP",
    disciplines: ["Inglês"],
    availabilities: [
      { dayWeek: 2, start: "07:00", end: "11:00" },
      { dayWeek: 4, start: "19:00", end: "22:00" },
      { dayWeek: 6, start: "09:00", end: "13:00" },
    ],
  },
  {
    email: "lucas.souza@teacher.com",
    name: "Lucas Souza",
    biography: "Programador full-stack e professor de lógica de programação e algoritmos. Ensino Python, JavaScript e Web Dev com projetos reais do mercado de trabalho.",
    training: "Ciência da Computação (PUC-MG)",
    priceHour: 150.0,
    telephone: "31955554444",
    location: "Belo Horizonte, MG",
    disciplines: ["Programação", "Matemática"],
    availabilities: [
      { dayWeek: 3, start: "19:00", end: "22:00" },
      { dayWeek: 5, start: "19:00", end: "22:00" },
    ],
  },
  {
    email: "mariana.ferreira@teacher.com",
    name: "Mariana Ferreira",
    biography: "Professora de História e Geografia com ampla experiência no ensino médio. Preparo alunos para o ENEM com aulas dinâmicas e materiais atualizados.",
    training: "Licenciatura em História (UFMG)",
    priceHour: 60.0,
    telephone: "31944443333",
    location: "Belo Horizonte, MG",
    disciplines: ["História", "Geografia"],
    availabilities: [
      { dayWeek: 1, start: "10:00", end: "14:00" },
      { dayWeek: 2, start: "10:00", end: "14:00" },
      { dayWeek: 4, start: "10:00", end: "14:00" },
    ],
  },
];

async function main() {
  console.log("Seeding started...");

  const password_hash_admin = await bcrypt.hash("admin123456", 10);
  const password_hash_student = await bcrypt.hash("student123456", 10);
  const password_hash_teacher = await bcrypt.hash("teacher123456", 10);

  // ── Admin ──
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password_hash: password_hash_admin,
      role: Role.admin,
    },
  });

  // ── Student ──
  const studentUser = await prisma.user.upsert({
    where: { email: "student@student.com" },
    update: {},
    create: {
      email: "student@student.com",
      name: "Maria Aluna",
      password_hash: password_hash_student,
      role: Role.student,
    },
  });

  console.log("Base users created.");

  // ── Disciplines (garantia) ──
  const disciplineNames = [
    "Matemática", "Física", "Química", "Biologia",
    "Português", "Literatura", "História", "Geografia",
    "Inglês", "Programação",
  ];

  const disciplineMap: Record<string, string> = {};
  for (const name of disciplineNames) {
    const d = await prisma.discipline.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    disciplineMap[name] = d.id;
  }

  console.log("Disciplines created.");

  // ── Teachers loop ──
  let mainTeacherProfileId: string | null = null;

  for (const td of teachersData) {
    const user = await prisma.user.upsert({
      where: { email: td.email },
      update: {},
      create: {
        email: td.email,
        name: td.name,
        password_hash: password_hash_teacher,
        role: Role.teacher,
      },
    });

    const profile = await prisma.teacher.upsert({
      where: { userId: user.id },
      update: {
        biography: td.biography,
        training: td.training,
        priceHour: td.priceHour,
        telephone: td.telephone,
        // @ts-ignore — campo adicionado ao schema; types serão regenerados após prisma generate
        location: td.location,
      },
      create: {
        userId: user.id,
        biography: td.biography,
        training: td.training,
        priceHour: td.priceHour,
        telephone: td.telephone,
        // @ts-ignore
        location: td.location,
      },
    });

    if (td.email === "teacher@teacher.com") {
      mainTeacherProfileId = profile.id;
    }

    // Disciplines link
    for (const dName of td.disciplines) {
      const dId = disciplineMap[dName];
      if (!dId) continue;
      const linkId = `link-${profile.id}-${dId}`;
      await prisma.teacherDiscipline.upsert({
        where: { id: linkId },
        update: {},
        create: { id: linkId, teacherId: profile.id, disciplineId: dId },
      });
    }

    // Availabilities (só cria se não tem)
    const existing = await prisma.availability.findMany({ where: { teacherId: profile.id } });
    if (existing.length === 0) {
      for (const av of td.availabilities) {
        await prisma.availability.create({
          data: {
            teacherId: profile.id,
            dayWeek: av.dayWeek,
            timeStart: new Date(`1970-01-01T${av.start}:00Z`),
            timeEnd: new Date(`1970-01-01T${av.end}:00Z`),
          },
        });
      }
    }

    console.log(`  ✓ ${td.name} (${td.location})`);
  }

  console.log("Teachers created.");

  // ── Scheduling sample ──
  if (mainTeacherProfileId) {
    const existing = await prisma.scheduling.findFirst({
      where: { studentId: studentUser.id, teacherId: mainTeacherProfileId },
    });

    if (!existing) {
      await prisma.scheduling.create({
        data: {
          studentId: studentUser.id,
          teacherId: mainTeacherProfileId,
          disciplineId: disciplineMap["Matemática"],
          dateHourStart: new Date("2026-05-10T10:00:00Z"),
          dateHourEnd: new Date("2026-05-10T11:00:00Z"),
          status: SchedulingStatus.Pending,
          observation: "Gostaria de focar em álgebra linear.",
        },
      });
      console.log("Sample scheduling created.");
    }
  }

  console.log("\nSeed completed successfully!");
  console.log("─────────────────────────────");
  console.log("  admin@admin.com       / admin123456");
  console.log("  student@student.com   / student123456");
  console.log("  teacher@teacher.com   / teacher123456");
  console.log("  + 5 outros professores com diverse localidades");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });