import { ProductForm } from '../../../components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Product - Boat Mech Admin',
  description: 'Add a new product to the Boat Mech catalog.',
};

export default function AddNewProductPage() {
  return (
    <div>
      <ProductForm />
    </div>
  );
}
