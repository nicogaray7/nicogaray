import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function logAudit(
  action: string,
  opts?: {
    target?: string;
    meta?: Record<string, unknown>;
    actorEmail?: string | null;
    ip?: string | null;
  },
): Promise<void> {
  try {
    let actorEmail = opts?.actorEmail;
    if (actorEmail === undefined) {
      const session = await auth();
      actorEmail = session?.user?.email ?? null;
    }
    await prisma.auditLog.create({
      data: {
        action,
        actorEmail: actorEmail ?? null,
        target: opts?.target ?? null,
        meta: opts?.meta ? (opts.meta as Prisma.InputJsonValue) : undefined,
        ip: opts?.ip ?? null,
      },
    });
  } catch {
    // best effort, never throw
  }
}
