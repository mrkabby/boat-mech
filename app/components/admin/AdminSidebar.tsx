
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, PlusSquare, LayoutDashboard, Users, DollarSign, Package, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/Logo';
import { Separator } from '../ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products/new', label: 'Add Product', icon: PlusSquare },
  { href: '/admin/products', label: 'Manage Products', icon: Package }, // Changed icon
  { href: '/admin/orders', label: 'View Orders', icon: DollarSign },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="py-2 mb-4">
        <Logo />
      </div>
      <Separator className="mb-4" />
      <nav className="flex flex-col space-y-2 flex-grow">
        {adminNavItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? 'default' : 'ghost'}
            className={cn(
              "w-full justify-start",
              pathname === item.href && "bg-black text-white font-semibold hover:bg-gray-800"
            )}
            asChild
            onClick={() => setIsOpen(false)} // Close mobile menu when clicking a link
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="my-4" />
      <Button variant="outline" className="w-full justify-start" asChild onClick={() => setIsOpen(false)}>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white border-gray-300">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4 bg-white">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen flex-col border-r bg-white text-gray-900 p-4 sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
