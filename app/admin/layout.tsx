import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: 'Admin — Nico Garay',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-paper-cool min-h-screen">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
