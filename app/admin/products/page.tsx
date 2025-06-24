
import type { Metadata } from 'next';
import { ProductList } from '../../components/products/ProductList'; // Reusing ProductList for admin view
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Products - Boat Mech Admin',
  description: 'View, edit, or delete products in the Boat Mech catalog.',
};

export default function ManageProductsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">Manage Products</CardTitle>
            <CardDescription>Browse and manage your product catalog.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {/* 
            Future enhancements for admin product list:
            - Edit button for each product
            - Delete button for each product (with confirmation)
            - More detailed view (e.g., stock, SKU)
            - Admin-specific filters or sorting
          */}
          <ProductList />
        </CardContent>
      </Card>
    </div>
  );
}
