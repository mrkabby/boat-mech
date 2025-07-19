import type { Metadata } from 'next';
import { getOrders } from '../../lib/server/orders';
import OrderManagement from '../../components/admin/OrderManagement';
import { updateOrderStatusAction, deleteOrderAction } from '../../actions/orders';

export const metadata: Metadata = {
  title: 'Manage Orders - Boat Mech Admin',
  description: 'View and manage customer orders and shipments.',
};

export default async function ManageOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <OrderManagement 
        initialOrders={orders}
        onUpdateStatus={updateOrderStatusAction}
        onDeleteOrder={deleteOrderAction}
      />
    </div>
  );
}
