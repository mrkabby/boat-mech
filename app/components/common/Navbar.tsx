
"use client";

import Link from 'next/link';
import { ShoppingCart, User as UserIcon, LogIn, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  const cartItemCount = mounted ? getItemCount() : 0;
  
  const userEmailForAvatar = user?.email || `guest-${Date.now()}@example.com`; // Fallback for avatar generation
  const avatarFallbackChar = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'G');

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button - Only visible on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Right side actions - Desktop Only */}
        <div className="hidden md:flex items-center space-x-3 md:space-x-4">
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
                    <AvatarFallback className="bg-gray-800 text-white font-semibold">{avatarFallbackChar}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-lg" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://avatar.vercel.sh/${userEmailForAvatar}.png`} alt={user.name || userEmailForAvatar} />
                      <AvatarFallback className="bg-gray-800 text-white font-semibold">{avatarFallbackChar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-gray-900">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {user.email || "No email"}
                      </p>
                      {user.role === 'admin' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
            <Button asChild variant="ghost" size="sm" className="bg-gray-800 hover:bg-black text-white cursor-pointer">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-3">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              {/* Cart Link */}
              <Link
                href="/cart"
                className="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="mr-3 h-4 w-4" />
                <span>Shopping Cart</span>
                {cartItemCount > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>

              {/* User Actions */}
              {isLoading ? (
                <div className="flex items-center py-2">
                  <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse mr-3"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : user ? (
                <>
                  {/* User Profile */}
                  <Link
                    href="/profile"
                    className="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="mr-3 h-4 w-4" />
                    <span>My Account</span>
                  </Link>

                  {/* Admin Panel (if admin) */}
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full text-left"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                /* Login Button for non-authenticated users */
                <Link
                  href="/login"
                  className="flex items-center py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LogIn className="mr-3 h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
