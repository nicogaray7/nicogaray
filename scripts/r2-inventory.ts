/**
 * Inventory R2 bucket: count keys by prefix, identify orphans
 * (keys not referenced by any Photo row).
 */
import { PrismaClient } from '@prisma/client';
import { r2List } from '../lib/r2';

const prisma = new PrismaClient();

async function main() {
  const all = await r2List('');
  console.log(`Total R2 keys: ${all.length}`);

  const prefixes = new Map<string, number>();
  for (const k of all) {
    const p = k.split('/')[0];
    prefixes.set(p, (prefixes.get(p) ?? 0) + 1);
  }
  console.log('\nBy top-level prefix:');
  for (const [p, c] of prefixes) console.log(`  ${p.padEnd(20)} ${c}`);

  // Identify orphans
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
  console.log(`\nReferenced: ${referenced.size}`);
  console.log(`Orphans:    ${orphans.length}`);
  if (orphans.length > 0 && orphans.length <= 30) {
    console.log('\nOrphan keys:');
    for (const k of orphans) console.log('  ' + k);
  } else if (orphans.length > 30) {
    console.log('\nFirst 30 orphan keys:');
    for (const k of orphans.slice(0, 30)) console.log('  ' + k);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
