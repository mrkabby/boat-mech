
"use client";

import Link from 'next/link';
import { ShoppingCart, User as UserIcon, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { useEffect, useState } from 'react';


export function Navbar() {
  const { getItemCount } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  const cartItemCount = mounted ? getItemCount() : 0;
  
  const userEmailForAvatar = user?.email || `guest-${Date.now()}@example.com`; // Fallback for avatar generation
  const avatarFallbackChar = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'G');


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center space-x-4 md:space-x-6">
        
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex items-center space-x-3 md:space-x-4">
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          {isLoading ? (
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${userEmailForAvatar}.png`} alt={user.name || userEmailForAvatar} data-ai-hint="user avatar" />
                    <AvatarFallback className="bg-blue-600 text-white font-semibold">{avatarFallbackChar}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://avatar.vercel.sh/${userEmailForAvatar}.png`} alt={user.name || userEmailForAvatar} />
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">{avatarFallbackChar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email || "No email"}
                      </p>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem asChild className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors">
                  <Link href="/profile" className="flex items-center w-full"> 
                    <UserIcon className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-900">My Profile</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Link href="/admin" className="flex items-center w-full">
                      <LayoutDashboard className="mr-3 h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={logout}
                  className="cursor-pointer p-2 hover:bg-red-50 rounded-md transition-colors text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
