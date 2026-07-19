import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import { LogOut } from 'lucide-react';
import { NavClient, TopNavClient } from './NavClient';

export const dynamic = 'force-dynamic';

export default async function AuthedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-paper-cool">
      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-60 lg:flex-col bg-white border-r border-line z-30">
        {/* Marque */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-line">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">Nico Garay</span>
            <span className="rounded-full bg-accent/10 text-accent text-[10px] font-semibold px-2 py-0.5">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <NavClient />
        </div>

        {/* Logout */}
        <div className="border-t border-line p-3">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-muted hover:bg-paper-cool hover:text-ink transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Top bar mobile */}
      <header className="lg:hidden bg-white border-b border-line sticky top-0 z-30">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">Nico Garay</span>
            <span className="rounded-full bg-accent/10 text-accent text-[10px] font-semibold px-2 py-0.5">Admin</span>
          </Link>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/admin/login' });
            }}
          >
            <button type="submit" className="text-ink-muted hover:text-ink transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
        <div className="border-t border-line">
          <TopNavClient />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="lg:pl-60">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
