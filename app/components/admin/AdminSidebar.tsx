
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, LayoutDashboard, ListOrdered, Users, DollarSign, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/Logo';
import { Separator } from '../ui/separator';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products/new', label: 'Add Product', icon: PlusSquare },
  { href: '/admin/products', label: 'Manage Products', icon: Package }, // Changed icon
  { href: '/admin/orders', label: 'View Orders', icon: DollarSign },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen flex flex-col border-r bg-card text-card-foreground p-4 sticky top-0">
      <div className="py-2 mb-4">
        <Logo />
      </div>
      <Separator className="mb-4" />
      <nav className="flex flex-col space-y-2 flex-grow">
        {adminNavItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start",
              pathname === item.href && "font-semibold"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="my-4" />
      <Button variant="outline" className="w-full justify-start" asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
      </Button>
    </aside>
  );
}
