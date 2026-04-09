import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, SchedulingStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding started...");

  const password_hash_admin = await bcrypt.hash("admin123456", 10);
  const password_hash_student = await bcrypt.hash("student123456", 10);
  const password_hash_teacher = await bcrypt.hash("teacher123456", 10);

  // 1. Create Users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password_hash: password_hash_admin,
      role: Role.admin,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@student.com" },
    update: {},
    create: {
      email: "student@student.com",
      name: "Student User",
      password_hash: password_hash_student,
      role: Role.student,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@teacher.com" },
    update: {},
    create: {
      email: "teacher@teacher.com",
      name: "Teacher Professional",
      password_hash: password_hash_teacher,
      role: Role.teacher,
    },
  });

  console.log("Users created.");

  // 2. Create Teacher Profile
  const teacherProfile = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      biography: "Sou professor de matemática e física há mais de 10 anos.",
      training: "Bacharelado em Matemática (USP)",
      priceHour: 50.0,
      telephone: "11999999999",
    },
  });

  console.log("Teacher profile created.");

  // 3. Create Disciplines
  const mathDiscipline = await prisma.discipline.upsert({
    where: { name: "Matemática" },
    update: {},
    create: { name: "Matemática" },
  });

  const physicsDiscipline = await prisma.discipline.upsert({
    where: { name: "Física" },
    update: {},
    create: { name: "Física" },
  });

  console.log("Disciplines created.");

  // 4. Link Teacher and Disciplines
  await prisma.teacherDiscipline.upsert({
    where: {
      id: "math-link-" + teacherProfile.id,
    },
    update: {},
    create: {
      id: "math-link-" + teacherProfile.id,
      teacherId: teacherProfile.id,
      disciplineId: mathDiscipline.id,
    },
  });

  await prisma.teacherDiscipline.upsert({
    where: {
      id: "physics-link-" + teacherProfile.id,
    },
    update: {},
    create: {
      id: "physics-link-" + teacherProfile.id,
      teacherId: teacherProfile.id,
      disciplineId: physicsDiscipline.id,
    },
  });

  console.log("Teacher disciplines linked.");

  // 5. Create Availability
  // We'll use create instead of upsert if we don't have a unique ID that's easy to generate
  // So we first clear or just add if empty
  const teacherAvailabilities = await prisma.availability.findMany({
    where: { teacherId: teacherProfile.id },
  });

  if (teacherAvailabilities.length === 0) {
    await prisma.availability.create({
      data: {
        teacherId: teacherProfile.id,
        dayWeek: 1, // Segunda-feira
        timeStart: new Date("1970-01-01T08:00:00Z"),
        timeEnd: new Date("1970-01-01T12:00:00Z"),
      },
    });

    await prisma.availability.create({
      data: {
        teacherId: teacherProfile.id,
        dayWeek: 3, // Quarta-feira
        timeStart: new Date("1970-01-01T14:00:00Z"),
        timeEnd: new Date("1970-01-01T18:00:00Z"),
      },
    });
    console.log("Availability created.");
  }

  // 6. Create Scheduling
  const existingScheduling = await prisma.scheduling.findFirst({
    where: {
      studentId: studentUser.id,
      teacherId: teacherProfile.id,
    },
  });

  if (!existingScheduling) {
    await prisma.scheduling.create({
      data: {
        studentId: studentUser.id,
        teacherId: teacherProfile.id,
        disciplineId: mathDiscipline.id,
        dateHourStart: new Date("2026-05-10T10:00:00Z"),
        dateHourEnd: new Date("2026-05-10T11:00:00Z"),
        status: SchedulingStatus.Pending,
        observation: "Gostaria de focar em álgebra linear.",
      },
    });
    console.log("Scheduling created.");
  }

  console.log("Seed completed successfully!");
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