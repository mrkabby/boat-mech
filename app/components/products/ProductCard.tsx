"use client";
import Image from 'next/image';
import Link from 'next/link';
import type { SerializedProduct } from '../../types/index';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: SerializedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square relative w-full cursor-pointer overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain hover:scale-105 transition-transform duration-300"
              data-ai-hint={product.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="text-lg font-semibold leading-tight mb-1 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</CardDescription>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          {product.rating && (
             <div className="flex items-center text-sm text-muted-foreground">
               <Star className="h-4 w-4 fill-accent text-accent mr-1" />
               <span>{product.rating.toFixed(1)} ({product.reviews || 0})</span>
             </div>
          )}
        </div>
        <p className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex flex-col sm:flex-row w-full gap-2">
          <Button 
            variant="outline"
            className="flex-1 min-w-0" 
            size="sm"
            asChild
          >
            <Link href={`/products/${product.id}`} className="flex items-center justify-center">
              <Eye className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="truncate">View</span>
            </Link>
          </Button>
          <Button 
            className="flex-1 min-w-0 bg-blue-600 hover:bg-blue-700 text-white" 
            size="sm"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-1 h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
