import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const records = await prisma.analytics.findMany({
      orderBy: { timestampBucket: 'desc' },
    });
    console.log('Analytics Records:');
    console.log(JSON.stringify(records, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
