
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Link from 'next/link';
import { PlusSquare, Package, Users, DollarSign } from 'lucide-react'; // Changed ListOrdered to Package

export const metadata: Metadata = {
  title: 'Admin Dashboard - Boat Mech',
  description: 'Manage products, orders, and users for Boat Mech.',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
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
          <CardDescription>A brief overview of your store&apos;s performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Statistics will be displayed here in a future update.</p>
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
