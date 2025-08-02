import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductById } from '../../lib/server/products';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Star, Package, Truck, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { AddToCartButton } from '../../components/products/AddToCartButton';
import type { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found - Boat Mech',
      description: 'The requested product could not be found.',
    };
  }
  
  return {
    title: `${product.name} - Boat Mech`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const isInStock = product.stock > 0;
  const isLowStock = product.stock <= 10 && product.stock > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square relative w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                  priority
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Product Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Fast Shipping Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Secure Packaging</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <Badge variant="secondary" className="mb-4">
              {product.category}
            </Badge>
            
            {/* Price and Rating */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </div>
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.reviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isInStock ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className={`text-sm font-medium ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                    {isLowStock ? `Only ${product.stock} left in stock` : `${product.stock} in stock`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-600">Out of stock</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <AddToCartButton product={product} disabled={!isInStock} />
            
            {!isInStock && (
              <p className="text-sm text-gray-500 text-center">
                This item is currently out of stock. Please check back later.
              </p>
            )}
          </div>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock:</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
