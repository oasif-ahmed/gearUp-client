"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, User, Settings, LogOut, LayoutDashboard, ShieldAlert } from "lucide-react";
import { logoutUser } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profile?: {
    profilePhoto: string;
  };
}

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Scroll compression effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  // Role checks
  const userRole = user?.role?.toUpperCase();
  const isProvider = userRole === "PROVIDER";
  const isAdmin = userRole === "ADMIN";
  const isCustomer = userRole === "CUSTOMER";

  // Helper for active link highlighting
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gear Items", href: "/gear-items" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 sm:px-6 lg:px-8 transition-all duration-300">
      <nav
        className={`mx-auto max-w-6xl border border-zinc-200/80 bg-[#FDFBF7]/90 backdrop-blur-md text-zinc-900 px-4 transition-all duration-300 rounded-none shadow-xs ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-8 w-8 items-center justify-center bg-zinc-900 text-white shadow-xs rounded-none group-hover:bg-zinc-800 transition-colors">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900 font-mono">
                Gear Up
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center space-x-1.5 md:flex font-mono text-xs">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 uppercase transition-all rounded-none ${
                    active
                      ? "bg-zinc-900 text-white font-semibold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & User Profile */}
          <div className="hidden items-center space-x-3 md:flex font-mono">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium h-8 px-3 rounded-none text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 uppercase"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 rounded-none px-3 uppercase tracking-wider font-semibold">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-none p-0 focus-visible:ring-0 border border-zinc-300"
                  >
                    <div className="h-8 w-8 rounded-none bg-zinc-100 flex items-center justify-center overflow-hidden">
                      {user?.profile?.profilePhoto ? (
                        <img
                          src={user?.profile?.profilePhoto}
                          alt={user?.name || "User Avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold font-mono text-zinc-900">
                          {getInitials(user?.name || "User")}
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-none border-zinc-200 bg-[#FDFBF7] text-zinc-900 font-mono text-xs shadow-md" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold leading-none text-zinc-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] leading-none text-zinc-500">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-200" />
                  
                  {isProvider && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/provider" className="cursor-pointer text-xs rounded-none hover:bg-zinc-100 focus:bg-zinc-100">
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>Provider Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isCustomer && (
                    <DropdownMenuItem asChild>
                      <Link href="/customer-cart" className="cursor-pointer text-xs rounded-none hover:bg-zinc-100 focus:bg-zinc-100">
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>My Cart</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin" className="cursor-pointer text-xs rounded-none hover:bg-zinc-100 focus:bg-zinc-100">
                        <ShieldAlert className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-xs rounded-none hover:bg-zinc-100 focus:bg-zinc-100">
                      <User className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer text-xs rounded-none hover:bg-zinc-100 focus:bg-zinc-100">
                      <Settings className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-200" />
                  <DropdownMenuItem
                    className="cursor-pointer text-xs text-red-600 focus:bg-red-50 focus:text-red-600 rounded-none"
                    disabled={isPending}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    <span>{isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none text-zinc-900 hover:bg-zinc-200/50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="mt-3 border-t border-zinc-200 pt-3 md:hidden font-mono text-xs">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 uppercase transition-all ${
                      active
                        ? "bg-zinc-900 text-white font-bold"
                        : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3">
              {user ? (
                <>
                  {isProvider && (
                    <Link
                      href="/dashboard/provider"
                      className="inline-flex items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 uppercase"
                      onClick={() => setIsOpen(false)}
                    >
                      Provider Dashboard
                    </Link>
                  )}
                  {isCustomer && (
                    <Link
                      href="/customer-cart"
                      className="inline-flex items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 uppercase"
                      onClick={() => setIsOpen(false)}
                    >
                      My Cart
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/dashboard/admin"
                      className="inline-flex items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 uppercase"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    disabled={isPending}
                    className="inline-flex items-center justify-center bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 uppercase"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    {isPending ? "Logging out..." : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-100 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center bg-zinc-900 text-white px-3 py-2 text-xs font-bold hover:bg-zinc-800 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}