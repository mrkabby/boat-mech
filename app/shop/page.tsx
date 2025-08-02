import { ProductList } from '../components/products/ProductList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop - Boat Mech Tool & Hardware Store',
  description: 'Browse our complete selection of quality tools and hardware. Power tools, hand tools, generators, pumps, ladders, and more.',
};

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop All Products</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find everything you need for your projects. Quality tools, generators, pumps, ladders, and hardware equipment.
        </p>
      </div>
      
      <ProductList />
    </div>
  );
}
