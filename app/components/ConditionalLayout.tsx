"use client";

import { Navbar } from './common/Navbar';
import { Footer } from './common/Footer';
import { usePathname } from 'next/navigation';
import { cn } from '../lib/utils';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={cn(
          "flex-grow",
          !isAdminRoute && "container mx-auto px-4 py-8"
        )}
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
