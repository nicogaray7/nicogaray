import { PrismaClient } from '@prisma/client';
import { r2List, r2Delete } from '../lib/r2';

const prisma = new PrismaClient();

async function main() {
  const force = process.argv.includes('--yes');
  console.log('--- R2 + DB cleanup ---');

  const keys = await r2List('photos/');
  const photoCount = await prisma.photo.count();
  console.log(`R2 keys (prefix=photos/): ${keys.length}`);
  console.log(`Photos in DB:             ${photoCount}`);

  if (!force) {
    console.log('');
    console.log('This will DELETE all R2 objects under photos/ and all rows in Photo.');
    console.log('Re-run with --yes to confirm.');
    process.exit(0);
  }

  console.log('');
  console.log('Deleting R2 objects…');
  let i = 0;
  for (const key of keys) {
    await r2Delete(key).catch((err) => console.error('Failed to delete', key, err.message));
    i++;
    if (i % 25 === 0) console.log(`  ${i}/${keys.length}`);
  }
  console.log(`  ${i}/${keys.length} done`);

  console.log('Deleting Order + Photo rows…');
  await prisma.order.deleteMany({});
  await prisma.photo.deleteMany({});
  console.log('Done.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
