import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const link = await prisma.link.upsert({
      where: { code: 'test-link' },
      update: {},
      create: {
        code: 'test-link',
        longUrl: 'https://example.com',
        createdBy: 'anonymous',
      },
    });
    console.log('Link seeded:', link);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
