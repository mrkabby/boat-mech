// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from './components/Providers';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { cn } from './lib/utils';
import { ConditionalLayout } from './components/ConditionalLayout';

// Font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// ✅ Static metadata (now supported again)
export const metadata: Metadata = {
  title: 'Boat Mech - Your Marine Parts Expert',
  description: 'Find all your boat parts and accessories at Boat Mech.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <AppProviders>
          <div className="relative flex min-h-screen flex-col">
            <ConditionalLayout>{children}</ConditionalLayout>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
