"use client";

import React from "react";
import Link from "next/link";
import { Rocket, GitBranch, MessageSquare, Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-muted-foreground py-8 font-mono text-xs transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Row: Brand & Centered Navigation Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border/80 pb-6">
          
          {/* Logo & Headline */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-xs group-hover:bg-primary/90 transition-colors">
              <Rocket className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground font-serif">
              Gear Up
            </span>
          </Link>

          {/* Compact Centered Links */}
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gear-items" className="hover:text-foreground transition-colors">
                  Gear Items
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/customer-cart" className="hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Icons */}
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="h-7 w-7 rounded-none border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="GitHub"
            >
              <GitBranch className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="h-7 w-7 rounded-none border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Community"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="h-7 w-7 rounded-none border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Website"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
            <a
              href="mailto:contact@gearuclient.com"
              className="h-7 w-7 rounded-none border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>

        {/* Bottom Bar Ledger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono">
          <p>© {new Date().getFullYear()} GearUp Operations. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <span>•</span>
            <span className="text-emerald-600 font-medium">System Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
}