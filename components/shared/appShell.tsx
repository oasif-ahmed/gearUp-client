"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

type NavbarUser = React.ComponentProps<typeof Navbar>["user"];

const AUTH_PAGES = ["/login", "/register"];

export default function AppShell({
  user,
  children,
}: {
  user?: NavbarUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname ? AUTH_PAGES.includes(pathname) : false;

  return (
    <>
      {!isAuthPage && <Navbar user={user} />}
      <main className={`min-h-screen ${isAuthPage ? "" : "pb-16 md:pb-0"}`}>
        {children}
        <Toaster richColors position="top-center" />
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
