import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Generate a unique code
    const code = `google_${Math.random().toString(36).substring(2, 8)}`;
    const longUrl = 'https://www.google.com';
    const createdBy = 'user_123';

    console.log(`Inserting code: ${code}`);
    const inserted = await prisma.link.create({
      data: {
        code,
        longUrl,
        createdBy,
      },
    });
    console.log(`inserted code: ${inserted.code}`);

    console.log(`Selecting code: ${inserted.code}`);
    const selected = await prisma.link.findUnique({
      where: { code: inserted.code },
    });
    
    if (selected) {
      console.log(`selected code: ${selected.code}`);
      console.log(`matched long_url: ${selected.longUrl}`);
    } else {
      console.log('Error: code not found');
    }
  } catch (e) {
    console.error('Database query failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
