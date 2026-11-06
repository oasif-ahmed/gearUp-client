"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Menu, X, Rocket, User, Settings, LogOut, LayoutDashboard, ShieldAlert } from "lucide-react";
import { logoutUser } from "@/services/auth.service"; // Adjust import path if needed

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

const Navbar = ({ user }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  // Role checks (case-insensitive for safety)
  const userRole = user?.role?.toUpperCase();
  const isProvider = userRole === "PROVIDER";
  const isAdmin = userRole === "ADMIN";
  const isCustomer = userRole === "CUSTOMER";

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 sm:px-6 lg:px-8">
      {/* Contained Floating / Island Navbar */}
      <nav className="mx-auto max-w-6xl border border-black-200 bg-background/90 px-4 py-2.5 shadow-xs backdrop-blur-md">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center bg-zinc-900 text-white shadow-xs rounded-none">
                <Rocket className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-zinc-900">
                Gear Up
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link
              href="/"
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/gear-items"
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Gear Items
            </Link>
            <Link
              href="#features"
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900"
            >
              About
            </Link>
          </div>

          {/* Actions & Profile (Desktop) */}
          <div className="hidden items-center space-x-2 md:flex">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium text-zinc-600 hover:text-zinc-900 h-8 px-3 rounded-none"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 rounded-none px-3">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-none p-0 focus-visible:ring-0"
                  >
                    <div className="h-8 w-8 rounded-none border border-zinc-200 bg-zinc-100 flex items-center justify-center overflow-hidden">
                      {user?.profile?.profilePhoto ? (
                        <img
                          src={user?.profile?.profilePhoto}
                          alt={user?.name || "User Avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium font-mono text-zinc-800">
                          {getInitials(user?.name || "User")}
                        </span>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-none border-zinc-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium leading-none text-zinc-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] font-mono leading-none text-zinc-500">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {isProvider && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/provider" className="cursor-pointer text-xs rounded-none">
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>Provider Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Conditionally render Customer Cart */}
                  {isCustomer && (
                    <DropdownMenuItem asChild>
                      <Link href="/customer-cart" className="cursor-pointer text-xs rounded-none">
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>My Cart</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Conditionally render Admin Dashboard */}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/admin" className="cursor-pointer text-xs rounded-none">
                        <ShieldAlert className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-xs rounded-none">
                      <User className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer text-xs rounded-none">
                      <Settings className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
              className="h-8 w-8 rounded-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown Inside the Container */}
        {isOpen && (
          <div className="mt-3 border-t border-zinc-200 pt-3 md:hidden">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/gear-items"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                Gear Items
              </Link>
              <Link
                href="#features"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-2 border-t border-zinc-200 pt-3">
              {user ? (
                <>
                  {isProvider && (
                    <Link
                      href="/dashboard/provider"
                      className="inline-flex items-center justify-center rounded-none border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Provider Dashboard
                    </Link>
                  )}
                  {isCustomer && (
                    <Link
                      href="/customer-cart"
                      className="inline-flex items-center justify-center rounded-none border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                      onClick={() => setIsOpen(false)}
                    >
                      My Cart
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/dashboard/admin"
                      className="inline-flex items-center justify-center rounded-none border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center rounded-none border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                    onClick={() => setIsOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-none bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
                    className="inline-flex items-center justify-center rounded-none border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-none bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
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
};

export default Navbar;