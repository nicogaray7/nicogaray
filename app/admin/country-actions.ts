'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

const schema = z.object({
  code: z.string().length(2),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  intro: z.string().optional(),
  introEn: z.string().optional(),
});

export async function updateCountry(formData: FormData) {
  await requireAdmin();
  const parsed = schema.parse(Object.fromEntries(formData.entries()));
  await prisma.country.update({
    where: { code: parsed.code.toUpperCase() },
    data: {
      nameFr: parsed.nameFr,
      nameEn: parsed.nameEn,
      intro: parsed.intro || null,
      introEn: parsed.introEn || null,
    },
  });
  revalidatePath('/admin/countries');
  revalidatePath(`/admin/countries/${parsed.code}`);
  revalidatePath(`/fr/country/${parsed.code}`);
  revalidatePath(`/en/country/${parsed.code}`);
  revalidatePath('/fr/map');
  revalidatePath('/en/map');
  redirect('/admin/countries');
}
