import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@admin.com",
      password_hash: "admin123456",
      role: "admin"
    },
  });
  const student = await prisma.user.upsert({
    where: { email: "student@student.com" },
    update: {},
    create: {
      email: "student@student.com",
      name: "Student",
      password_hash: "student123456",
      role: "student",
    },
  });
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@teacher.com" },
    update: {},
    create: {
      email: "teacher@teacher.com",
      name: "Teacher",
      password_hash: "teacher123456",
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