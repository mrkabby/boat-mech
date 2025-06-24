
"use client";

import Image from 'next/image';
import type { CartItem } from '../../types/index';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border">
        <Image 
            src={item.imageUrl} 
            alt={item.name} 
            layout="fill" 
            objectFit="cover"
            data-ai-hint={item.imageHint}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.category}</p>
        <p className="text-md font-medium text-primary mt-1">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input 
          type="number" 
          value={item.quantity} 
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          className="w-16 h-9 text-center"
          min="1"
          max={item.stock}
        />
        <Button variant="outline" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)} disabled={item.quantity >= item.stock}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-lg font-semibold w-24 text-right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
