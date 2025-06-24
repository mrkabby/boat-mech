
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Loader2, ShoppingCart } from 'lucide-react';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

// Metadata for client components should be handled differently,
// e.g. using a custom hook or directly setting document.title in useEffect.
// For simplicity, we'll set title in RootLayout or rely on a default.

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { getItemCount, isLoading: cartLoading } = useCart(); // Assuming cart might have a loading state
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    document.title = "Checkout - Boat Mech";
  }, []);


  if (authLoading || cartLoading) { // Check both auth and cart loading
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be caught by the redirect effect,
    // but as a fallback during quick state transitions.
     return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  if (getItemCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">
          You need to add items to your cart before you can checkout.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Secure Checkout
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete your order by providing your shipping and payment details below.
        </p>
      </header>
      <CheckoutForm />
    </div>
  );
}
