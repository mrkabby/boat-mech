import type { Metadata } from 'next';
import { EditProductForm } from '../../../../components/admin/EditProductForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Edit Product - Boat Mech Admin',
  description: 'Edit product details in the Boat Mech catalog.',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black">Edit Product</CardTitle>
          <CardDescription className="text-gray-600">
            Update the product information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditProductForm productId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
