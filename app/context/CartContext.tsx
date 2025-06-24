
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '../types/index';
import { useToast } from '../hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isLoading: boolean; // Added loading state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading to true
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedCart = localStorage.getItem('boatmech_cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem('boatmech_cart');
    } finally {
      setIsLoading(false); // Set loading to false after attempt
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    // Only save if not loading, to prevent writing initial empty state before hydration
    if (!isLoading) {
       if(cartItems.length > 0 || localStorage.getItem('boatmech_cart')) { 
        localStorage.setItem('boatmech_cart', JSON.stringify(cartItems));
       } else if (cartItems.length === 0 && localStorage.getItem('boatmech_cart')) {
        // If cart becomes empty, remove it from local storage
        localStorage.removeItem('boatmech_cart');
       }
    }
  }, [cartItems, isLoading]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantityToAdd, product.stock) } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: Math.min(quantityToAdd, product.stock) }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
      title: "Removed from cart",
      description: `Item has been removed from your cart.`,
      variant: "destructive"
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } : item 
      ).filter(item => item.quantity > 0) 
    );
  };

  const clearCart = () => {
    setCartItems([]);
    // localStorage.removeItem('boatmech_cart'); // This will be handled by the useEffect
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
