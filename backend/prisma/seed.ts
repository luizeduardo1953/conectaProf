import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.createMany({
        data: [
            {
            name: "Admin",
            email: "admin@admin.com",
            password_hash: "admin123456",
            role: "admin"
            },
            {
                name: "Aluno",
                email: "aluno@aluno.com",
                password_hash: "aluno123456",
                role: "student"
            },
            {
                name: "Professor",
                email: "professor@professor.com",
                password_hash: "professor123456",
                role: "teacher"
            },
        ],
    })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());