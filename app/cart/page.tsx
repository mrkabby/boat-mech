
"use client";

import { useCart } from '../context/CartContext';
import { CartItemCard } from '../components/cart/CartItemCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Your Shopping Cart</h1>
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Items ({getItemCount()})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {cartItems.map(item => (
            <CartItemCard key={item.id} item={item} />
          ))}
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row items-center justify-between p-6 border-t mt-4 space-y-4 md:space-y-0">
          <Button variant="outline" onClick={clearCart} className="w-full md:w-auto text-red-600 border-red-600 hover:bg-red-50 cursor-pointer">
            Clear Cart
          </Button>
          <div className="text-right w-full md:w-auto">
            <p className="text-2xl font-bold text-primary">
              Total: ${getCartTotal().toFixed(2)}
            </p>
            <Button size="lg" asChild className="w-full md:w-auto mt-4 bg-green-600 hover:bg-green-700 text-white cursor-pointer">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
