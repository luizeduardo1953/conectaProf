const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() { 
  try { 
    await prisma.availability.create({ 
      data: { 
        dayWeek: 1, 
        timeStart: new Date('1970-01-01T08:00:00.000Z'), 
        timeEnd: new Date('1970-01-01T12:00:00.000Z'), 
        teacherId: '5ebfde40-ab5b-46db-b012-964a49db6500' 
      } 
    }); 
    console.log('success'); 
  } catch(e) { 
    console.error('ERROR_CAUGHT:', e); 
  } finally { 
    await prisma.$disconnect(); 
  } 
} 

run();
