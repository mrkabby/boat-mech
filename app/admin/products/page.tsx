
import type { Metadata } from 'next';
import { AdminProductList } from '../../components/admin/AdminProductList';
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
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-black">Manage Products</CardTitle>
            <CardDescription className="text-gray-600">Browse, edit, and manage your product catalog.</CardDescription>
          </div>
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AdminProductList />
        </CardContent>
      </Card>
    </div>
  );
}
