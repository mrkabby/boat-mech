
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { PlusSquare, Package, Users, DollarSign, TrendingUp, ShoppingCart } from 'lucide-react'; // Changed ListOrdered to Package
import AdminStatusChecker from '../components/AdminStatusChecker';
import { getProducts } from '../lib/server/products';
import { getUsers } from '../lib/server/users';
import { getOrders } from '../lib/server/orders';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Boat Mech',
  description: 'Manage products, orders, and users for Boat Mech.',
};

async function getDashboardStats() {
  try {
    const [products, users, orders] = await Promise.all([
      getProducts(),
      getUsers(),
      getOrders(),
    ]);

    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock < 10).length;

    return {
      totalProducts: products.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      lowStockProducts,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  return (
    <div className="space-y-8">
      <AdminStatusChecker />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Admin Dashboard</CardTitle>
          <CardDescription>Welcome to the Boat Mech administration panel. Manage your store here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            From this dashboard, you can manage products, view orders, and oversee users.
            Use the navigation sidebar to access different sections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardActionCard
              title="Add New Product"
              description="Create and list new items in your store."
              href="/admin/products/new"
              icon={PlusSquare}
            />
            <DashboardActionCard
              title="Manage Products"
              description="Edit, view, or remove existing products."
              href="/admin/products" 
              icon={Package} // Changed icon
              disabled={false} // Enabled
            />
            <DashboardActionCard
              title="View Orders"
              description="Check customer orders and their statuses."
              href="/admin/orders" 
              icon={DollarSign}
              disabled={false} // Enabled
            />
             <DashboardActionCard
              title="Manage Users"
              description="View and manage user accounts."
              href="/admin/users"
              icon={Users}
              disabled={false} // Enabled
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Overview of your store&apos;s current performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              description="Products in inventory"
            />
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              description="Registered customers"
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              description="All time orders"
            />
            <StatsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toFixed(2)}`}
              icon={DollarSign}
              description="Total paid orders"
            />
            <StatsCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={TrendingUp}
              description="Orders awaiting processing"
              alert={stats.pendingOrders > 0}
            />
            <StatsCard
              title="Low Stock Items"
              value={stats.lowStockProducts}
              icon={Package}
              description="Products with < 10 items"
              alert={stats.lowStockProducts > 0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  alert?: boolean;
}

function DashboardActionCard({ title, description, href, icon: Icon, disabled }: DashboardActionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild className="w-full" disabled={disabled}>
          <Link href={href}>{title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, icon: Icon, description, alert }: StatsCardProps) {
  return (
    <Card className={`${alert ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${alert ? 'text-orange-600' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${alert ? 'text-orange-600' : ''}`}>{value}</div>
        <p className={`text-xs ${alert ? 'text-orange-600' : 'text-muted-foreground'}`}>
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
