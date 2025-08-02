import { getProducts } from './lib/server/products';
import { ProductCard } from './components/products/ProductCard';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { HeroCarousel } from './components/common/HeroCarousel';
import Link from 'next/link';
import { ArrowRight, Wrench, Truck, Shield, Star } from 'lucide-react';
import type { Metadata } from 'next';
import type { SerializedProduct } from './types';

export const metadata: Metadata = {
  title: 'Boat Mech - Your Premier Tool & Hardware Store',
  description: 'Discover quality tools and hardware at Boat Mech. From power tools to hand tools, we have everything you need for your projects.',
};

export default async function HomePage() {
  let featuredProducts: SerializedProduct[] = [];
  
  try {
    const products = await getProducts();
    featuredProducts = products.slice(0, 6); // Show first 6 products as featured
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Boat Mech?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing the best tools and service for your projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Wrench className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                <CardTitle>Quality Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Premium tools from trusted brands that professionals rely on every day.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Truck className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                <CardTitle>Fast Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quick and reliable delivery to get your tools when you need them.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-gray-800 mx-auto mb-4" />
                <CardTitle>Quality Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every tool comes with our satisfaction guarantee and warranty support.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular tools and hardware
            </p>
          </div>
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center">
                <Button asChild size="lg">
                  <Link href="/shop">
                    View All Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">New products coming soon!</p>
              <Button asChild>
                <Link href="/shop">Browse Shop</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Excellent selection of tools and fast shipping. The quality is exactly what I expected.&quot;
                </p>
                <p className="font-semibold text-gray-900">- Mike Johnson</p>
                <p className="text-sm text-gray-500">Professional Contractor</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Great customer service and competitive prices. My go-to store for all hardware needs.&quot;
                </p>
                <p className="font-semibold text-gray-900">- Sarah Davis</p>
                <p className="text-sm text-gray-500">DIY Enthusiast</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Reliable tools that last. I&apos;ve been shopping here for years and never disappointed.&quot;
                </p>
                <p className="font-semibold text-gray-900">- Tom Rodriguez</p>
                <p className="text-sm text-gray-500">Master Electrician</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Boat Mech for their tool and hardware needs.
          </p>
          <Button asChild size="default" className="bg-white text-black hover:bg-gray-100 w-auto min-w-[160px] px-6 py-3">
            <Link href="/shop">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
