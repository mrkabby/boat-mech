
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Loader2 } from 'lucide-react';
// Toaster is removed from here as it's provided globally by AppProviders in RootLayout
// import { Toaster } from '@/components/ui/toaster'; 

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login?redirect=/admin'); // Redirect to login if not authenticated
      } else if (user.role !== 'admin') {
        router.replace('/'); // Redirect to home if not an admin
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // This case should ideally be handled by the redirect,
  // but as a fallback or during brief state transitions:
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-lg text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        {children}
        {/* <Toaster />  The global Toaster in AppProviders (RootLayout) handles toasts */}
      </main>
    </div>
  );
}

