import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import { LayoutDashboard, ImageIcon, ShoppingBag, LogOut, Globe, Settings, Shield } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export const dynamic = 'force-dynamic';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-paper border-b border-line">
        <Container size="wide">
          <div className="h-16 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="font-display text-xl text-ink">Nico Garay</span>
              <span className="eyebrow text-accent">Admin</span>
            </Link>
            <nav className="flex items-center gap-1">
              <AdminLink href="/admin" icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Dashboard" />
              <AdminLink href="/admin/photos" icon={<ImageIcon className="w-3.5 h-3.5" />} label="Photos" />
              <AdminLink href="/admin/countries" icon={<Globe className="w-3.5 h-3.5" />} label="Countries" />
              <AdminLink href="/admin/orders" icon={<ShoppingBag className="w-3.5 h-3.5" />} label="Orders" />
              <AdminLink href="/admin/settings" icon={<Settings className="w-3.5 h-3.5" />} label="Settings" />
              <AdminLink href="/admin/security" icon={<Shield className="w-3.5 h-3.5" />} label="Security" />
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/admin/login' });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </Container>
      </header>
      <main className="flex-1 py-12">{children}</main>
    </div>
  );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-ink transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
