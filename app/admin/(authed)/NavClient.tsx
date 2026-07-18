'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ImageIcon, ShoppingBag, Globe, Settings, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/photos', icon: ImageIcon, label: 'Photos' },
  { href: '/admin/countries', icon: Globe, label: 'Countries' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Commandes' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
  { href: '/admin/security', icon: Shield, label: 'Security' },
];

export function NavClient() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-paper-cool text-ink font-medium'
                : 'text-ink-muted hover:bg-paper-cool/60 hover:text-ink'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-accent" />
            )}
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TopNavClient() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 overflow-x-auto px-4">
      {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? 'bg-paper-cool text-ink font-medium'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
