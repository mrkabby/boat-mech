
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Loader2, ShoppingCart } from 'lucide-react';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { Button } from '../components/ui/button';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { getItemCount, isLoading: cartLoading } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    document.title = "Checkout - Boat Mech";
  }, []);

  if (authLoading || cartLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-black mb-4" />
        <p className="text-lg text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center text-center py-12">
        <Loader2 className="h-16 w-16 animate-spin text-black mb-4" />
        <p className="text-lg text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  if (getItemCount() === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-24 w-24 text-gray-400 mb-6" />
        <h1 className="text-3xl font-bold text-black mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          You need to add items to your cart before you can checkout.
        </p>
        <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white cursor-pointer">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order securely</p>
      </div>
      <CheckoutForm />
    </div>
  );
}
