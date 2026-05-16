const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('🚀 Starting Join Code Migration...');
  
  const classrooms = await prisma.classroom.findMany({
    where: {
      OR: [
        { joinCode: { equals: "" } },
        { joinCode: { contains: "-" } } // cuid() often contains hyphens, we want short codes
      ]
    }
  });

  console.log(`Found ${classrooms.length} classrooms needing update.`);

  for (const classroom of classrooms) {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await prisma.classroom.update({
      where: { id: classroom.id },
      data: { joinCode: newCode }
    });
    console.log(`Updated [${classroom.title}] -> ${newCode}`);
  }

  console.log('✅ Migration complete!');
}

migrate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
