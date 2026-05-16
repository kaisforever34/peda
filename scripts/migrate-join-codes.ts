import { prisma } from '../src/lib/prisma'

async function migrate() {
  console.log('🚀 Starting Join Code Migration...');
  
  try {
    const classrooms = await prisma.classroom.findMany({
      where: {
        OR: [
          { joinCode: { equals: "" } },
          { joinCode: { contains: "-" } }
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
  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
