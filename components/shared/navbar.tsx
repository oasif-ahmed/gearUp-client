
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Sun,
  Moon,
} from "lucide-react";
import dumbbellLogo from "../../dumbbell.png";
import { logoutUser } from "@/services/auth.service";
import { useTheme } from "@/components/theme-provider";

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
  k?: number;
}

export default function Navbar({ user, k }: NavbarProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className={`mx-auto max-w-6xl border-b-2 border-dashed border-border bg-card/90 backdrop-blur-md text-foreground px-4 transition-all duration-300 rounded-none shadow-xs ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                <Image
                  src={dumbbellLogo}
                  alt=""
                  priority
                  className="h-7 w-7 object-contain transition-opacity group-hover:opacity-80"
                />
              </span>

              <span className="font-[family-name:var(--font-manrope)] whitespace-nowrap text-lg font-extrabold uppercase leading-none tracking-[-0.055em] text-foreground transition-colors group-hover:text-primary sm:text-xl">
                GEAR<span className="text-primary">UP</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center space-x-1.5 md:flex font-mono text-xs">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 uppercase transition-all duration-200 rounded-md ${
                    active
                      ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions & User Profile */}
          <div className="hidden items-center space-x-3 md:flex font-mono">
            {/* Theme Toggle beside user image/actions */}
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 rounded-none text-muted-foreground hover:text-foreground hover:bg-accent/10 uppercase"
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}

            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-medium h-8 px-3 rounded-none text-muted-foreground hover:text-foreground hover:bg-accent/10 uppercase"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>

                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-3 uppercase tracking-wider font-semibold"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-auto py-1 px-2 rounded-none focus-visible:ring-0 border border-dashed border-border flex items-center gap-2.5 hover:bg-accent/10"
                  >
                    <div className="h-8 w-8 rounded-none bg-accent flex items-center justify-center overflow-hidden shrink-0">
                      {user?.profile?.profilePhoto ? (
                        <img
                          src={user?.profile?.profilePhoto}
                          alt={user?.name || "User Avatar"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold font-mono text-accent-foreground">
                          {getInitials(user?.name || "User")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold leading-none text-foreground">
                      {user?.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 rounded-lg border-dashed border-border bg-card text-foreground font-mono text-xs shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-bold leading-none text-foreground">
                        {user?.name || "User"}
                      </p>

                      <p className="text-[10px] leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-border" />

                  {isProvider && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/provider"
                        className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 transition-all duration-200 hover:translate-x-1"
                      >
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <span>Provider Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isCustomer && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/customer-cart"
                        className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 transition-all duration-200 hover:translate-x-1"
                      >
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <span>My Cart</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/admin"
                        className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 transition-all duration-200 hover:translate-x-1"
                      >
                        <ShieldAlert className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 transition-all duration-200 hover:translate-x-1"
                    >
                      <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href="/setting"
                      className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 transition-all duration-200 hover:translate-x-1"
                    >
                      <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer text-xs rounded-lg hover:bg-accent/10 focus:bg-accent/10 flex items-center gap-2 transition-all duration-200 hover:translate-x-1"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {mounted && (
                      <>
                        {theme === "dark" ? (
                          <Sun className="h-3.5 w-3.5" />
                        ) : (
                          <Moon className="h-3.5 w-3.5" />
                        )}

                        <span>
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg transition-all duration-200 hover:bg-destructive/10 hover:translate-x-1"
                    disabled={isPending}
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />

                    <span>
                      {isPending ? "Logging out..." : "Log out"}
                    </span>
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
              className="h-8 w-8 rounded-none text-foreground hover:bg-accent/10"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="mt-3 border-t border-dashed border-border pt-3 md:hidden font-mono text-xs animate-nav-menu-open">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 uppercase transition-all duration-200 ${
                      active
                        ? "bg-accent text-accent-foreground font-bold"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    } animate-fade-in-up`}
                    style={{ animationDelay: `${index * 80}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle in Mobile */}
            {mounted && (
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/10 uppercase animate-fade-in-up"
                style={{ animationDelay: `${navLinks.length * 80}ms` }}
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 mr-2" />
                ) : (
                  <Moon className="h-4 w-4 mr-2" />
                )}

                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            )}
          </div>
        )}

        {/* Mobile User Actions */}
        {isOpen && (
          <div
            className="mt-3 flex flex-col gap-2 border-t border-dashed border-border pt-3 animate-fade-in-up"
            style={{ animationDelay: `${(navLinks.length + 1) * 80}ms` }}
          >
            {user ? (
              <>
                <div className="px-3 py-1.5 flex items-center gap-2.5 border border-dashed border-border bg-accent/5">
                  <div className="h-8 w-8 rounded-none bg-accent flex items-center justify-center overflow-hidden shrink-0">
                    {user?.profile?.profilePhoto ? (
                      <img
                        src={user?.profile?.profilePhoto}
                        alt={user?.name || "User Avatar"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold font-mono text-accent-foreground">
                        {getInitials(user?.name || "User")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-foreground">{user?.name || "User"}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">{user?.role || "CUSTOMER"}</span>
                  </div>
                </div>

                {isProvider && (
                  <Link
                    href="/dashboard/provider"
                    className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    Provider Dashboard
                  </Link>
                )}

                {isCustomer && (
                  <Link
                    href="/customer-cart"
                    className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    My Cart
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    href="/dashboard/admin"
                    className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  href="/setting"
                  className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>

                <button
                  disabled={isPending}
                  className="inline-flex items-center justify-center bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground hover:opacity-90 disabled:opacity-50 uppercase"
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
                  className="inline-flex items-center justify-center border border-dashed border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-accent/10 uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-3 py-2 text-xs font-bold hover:opacity-90 uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
