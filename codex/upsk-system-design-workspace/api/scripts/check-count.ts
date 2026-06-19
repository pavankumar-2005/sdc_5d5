import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const analyticsCols = await prisma.$queryRaw`
      SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'analytics';
    `;
    console.log('Analytics Columns:', JSON.stringify(analyticsCols, null, 2));

    const linksCols = await prisma.$queryRaw`
      SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'links';
    `;
    console.log('Links Columns:', JSON.stringify(linksCols, null, 2));

    const clickEventsCols = await prisma.$queryRaw`
      SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'click_events';
    `;
    console.log('ClickEvent Columns:', JSON.stringify(clickEventsCols, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
