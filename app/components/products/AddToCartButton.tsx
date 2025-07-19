"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/use-toast';
import type { SerializedProduct } from '../../types';

interface AddToCartButtonProps {
  product: SerializedProduct;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      // Add the product with the specified quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      toast({
        title: "Added to cart!",
        description: `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart.`,
      });
      
      // Reset quantity after adding
      setQuantity(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-center space-x-3">
        <span className="text-sm font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseQuantity}
            disabled={quantity <= 1 || disabled}
            className="h-10 w-10 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="flex items-center justify-center h-10 w-12 text-sm font-medium border-x">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock || disabled}
            className="h-10 w-10 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || product.stock === 0}
        className="w-full h-12 text-lg"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isAdding ? 'Adding...' : `Add ${quantity > 1 ? `${quantity} ` : ''}to Cart`}
      </Button>

      {/* Stock Warning */}
      {quantity === product.stock && product.stock > 0 && (
        <p className="text-sm text-orange-600 text-center">
          Maximum quantity available: {product.stock}
        </p>
      )}
    </div>
  );
}
