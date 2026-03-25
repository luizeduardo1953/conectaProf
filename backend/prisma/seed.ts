import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {

  const password_hash_admin = await bcrypt.hash("admin123456", 10);
  const password_hash_student = await bcrypt.hash("student123456", 10);
  const password_hash_teacher = await bcrypt.hash("teacher123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password_hash: password_hash_admin,
      role: "admin"
    },
  });
  const student = await prisma.user.upsert({
    where: { email: "student@student.com" },
    update: {},
    create: {
      email: "student@student.com",
      name: "Student",
      password_hash: password_hash_student,
      role: "student",
    },
  });
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@teacher.com" },
    update: {},
    create: {
      email: "teacher@teacher.com",
      name: "Teacher",
      password_hash: password_hash_teacher,
      role: "teacher",
    },
  });
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