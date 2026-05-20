/**
 * Delete any R2 key not referenced by a Photo row.
 * Requires --yes to actually delete (safety guard).
 */
import { PrismaClient } from '@prisma/client';
import { r2List, r2Delete } from '../lib/r2';

const prisma = new PrismaClient();

async function main() {
  const force = process.argv.includes('--yes');

  const all = await r2List('');
  const photos = await prisma.photo.findMany({
    select: { originalKey: true, previewKey: true, thumbKey: true },
  });
  const referenced = new Set<string>();
  for (const p of photos) {
    referenced.add(p.originalKey);
    referenced.add(p.previewKey);
    referenced.add(p.thumbKey);
  }

  const orphans = all.filter((k) => !referenced.has(k));
  console.log(`R2 keys total:    ${all.length}`);
  console.log(`Referenced:       ${referenced.size}`);
  console.log(`Orphans to drop:  ${orphans.length}`);

  if (orphans.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  if (!force) {
    console.log('\nFirst 20 orphans:');
    for (const k of orphans.slice(0, 20)) console.log('  ' + k);
    console.log('\nRe-run with --yes to delete them.');
    return;
  }

  console.log('\nDeleting…');
  let i = 0;
  for (const key of orphans) {
    await r2Delete(key).catch((err) => console.error('fail', key, err.message));
    i++;
    if (i % 25 === 0) console.log(`  ${i}/${orphans.length}`);
  }
  console.log(`Done. Deleted ${i} object(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
