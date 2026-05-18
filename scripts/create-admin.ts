import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generatePassword(length = 20) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) out += charset[bytes[i] % charset.length];
  return out;
}

async function main() {
  const email = process.argv[2] ?? process.env.ADMIN_EMAIL;
  const passwordArg = process.argv[3] ?? process.env.ADMIN_PASSWORD;
  const name = process.argv[4] ?? process.env.ADMIN_NAME ?? 'Nico Garay';

  if (!email) {
    console.error('Usage: tsx scripts/create-admin.ts <email> [password] [name]');
    process.exit(1);
  }

  const password = passwordArg ?? generatePassword(20);
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, name },
    create: { email: email.toLowerCase(), passwordHash, name },
  });

  console.log('');
  console.log('Admin user ready:');
  console.log('  ID:       ', user.id);
  console.log('  Email:    ', user.email);
  console.log('  Name:     ', user.name);
  if (!passwordArg) {
    console.log('  Password: ', password);
    console.log('');
    console.log('Store this password securely — it will not be shown again.');
  } else {
    console.log('  Password:  (provided)');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
