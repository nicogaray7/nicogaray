import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const session = await auth();
  if (session?.user) redirect(searchParams.redirect ?? '/admin');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center space-y-3">
          <p className="eyebrow text-accent">Administration</p>
          <h1 className="text-display-lg font-display text-ink">Connexion</h1>
        </div>
        <LoginForm redirectTo={searchParams.redirect} initialError={searchParams.error} />
      </div>
    </div>
  );
}
