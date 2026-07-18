import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Container } from '@/components/layout/Container';
import { PageHeader, Card, StatusPill, EmptyState } from '@/components/admin';
import { SecurityClient } from '../SecurityClient';

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const [user, auditLogs] = await Promise.all([
    prisma.adminUser.findUnique({ where: { email: session.user.email } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
  ]);

  if (!user) redirect('/admin/login');

  return (
    <Container size="wide">
      <PageHeader eyebrow="Compte" title="Security" />

      <div className="space-y-6">
        {/* Two-factor authentication */}
        <Card title="Two-factor authentication">
          <div className="flex items-center gap-3 mb-6">
            <StatusPill
              status={user.totpEnabled ? 'enabled' : 'disabled'}
              tone={user.totpEnabled ? 'green' : 'neutral'}
            />
            <span className="text-sm text-ink-muted">
              {user.totpEnabled
                ? "La 2FA est active sur votre compte."
                : "La 2FA n'est pas encore activee."}
            </span>
          </div>
          <SecurityClient enabled={user.totpEnabled} />
        </Card>

        {/* Last login */}
        <Card title="Dernière connexion">
          {user.lastLoginAt ? (
            <p className="text-ink text-sm">
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(user.lastLoginAt)}
            </p>
          ) : (
            <p className="text-sm text-ink-muted">Aucune connexion enregistree.</p>
          )}
        </Card>

        {/* Audit log */}
        <Card title="Journal d'audit">
          {auditLogs.length === 0 ? (
            <EmptyState title="Aucun evenement" description="Le journal d'audit est vide." />
          ) : (
            <>
              {/* Mobile : liste empilee */}
              <ul className="md:hidden divide-y divide-line">
                {auditLogs.map((log) => (
                  <li key={log.id} className="py-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <StatusPill status={log.action} tone="neutral" />
                      <span className="text-xs text-ink-muted whitespace-nowrap">
                        {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(log.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs text-ink-muted break-all">
                      {log.actorEmail ?? '-'}
                      {log.target ? ` · ${log.target}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
              {/* Desktop : tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line bg-paper-cool">
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-ink-muted">Date</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-ink-muted">Action</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-ink-muted">Acteur</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-ink-muted">Cible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="border-b border-line last:border-0 hover:bg-paper-cool/60">
                        <td className="py-3 px-3 text-xs text-ink-muted whitespace-nowrap">
                          {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(log.createdAt)}
                        </td>
                        <td className="py-3 px-3">
                          <StatusPill status={log.action} tone="neutral" />
                        </td>
                        <td className="py-3 px-3 text-sm text-ink-muted">{log.actorEmail ?? '-'}</td>
                        <td className="py-3 px-3 text-sm text-ink-muted">{log.target ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </Container>
  );
}
