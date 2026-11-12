"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  UserCheck,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background py-12 text-foreground font-mono text-xs selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Header Hero Section */}
        <div className="border-b border-border pb-12 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="rounded-none bg-primary text-primary-foreground hover:bg-primary text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
              [ Platform Capabilities & Specifications ]
            </Badge>
            <span className="text-[10px] uppercase text-muted-foreground tracking-wider">
              • Full-Stack Feature Matrix
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground font-serif max-w-3xl leading-tight">
            Comprehensive feature suites engineered for modern equipment logistics.
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed font-sans pt-2">
            GearUp is structured around four distinct operational tiers. Explore our public cataloging, customer rental workflows, vendor inventory controls, and centralized administrative oversight tools.
          </p>
        </div>

        {/* SECTION 1: PUBLIC & CUSTOMER FEATURES */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3 flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Public & Customer Modules
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">Client-Facing Experience</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Public Discovery Card */}
            <div className="bg-card border border-border p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-foreground text-sm uppercase flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" /> Public Discovery
                </span>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase">Open Access</Badge>
              </div>

              <div className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">01</span>
                  <div>
                    <strong className="text-foreground block">Global Gear Directory</strong>
                    <span>Browse available sports and outdoor equipment with real-time stock indicators and high-res media galleries.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">02</span>
                  <div>
                    <strong className="text-foreground block">Advanced Filtering</strong>
                    <span>Quickly sort inventory items by category, price ranges, brand classifications, and availability status.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">03</span>
                  <div>
                    <strong className="text-foreground block">Detailed Technical Specs</strong>
                    <span>Inspect item conditions, daily rental rates, security deposits, and customized technical parameter sheets.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Portal Card */}
            <div className="bg-card border border-border p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-foreground text-sm uppercase flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" /> Customer Portal & Checkout
                </span>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase">Renter Workspace</Badge>
              </div>

              <div className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">01</span>
                  <div>
                    <strong className="text-foreground block">Rental Order Booking</strong>
                    <span>Select start/end reservation windows, configure item quantities, and submit rental orders directly.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">02</span>
                  <div>
                    <strong className="text-foreground block">Secure Gateway Payments</strong>
                    <span>Process transactions safely using integrated payment gateways like Stripe and SSLCommerz.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">03</span>
                  <div>
                    <strong className="text-foreground block">Verified Reviews & Ratings</strong>
                    <span>Post, edit, and delete equipment ratings and feedback comments upon completing rental returns.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: PROVIDER & ADMIN FEATURES */}
        <div className="space-y-6 pt-4">
          <div className="border-b border-border pb-3 flex justify-between items-center">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" /> Provider & Administrative Controls
            </h2>
            <span className="text-[10px] text-muted-foreground font-mono">Backend Operations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Provider Management Card */}
            <div className="bg-card border border-border p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-foreground text-sm uppercase flex items-center gap-2">
                  <Store className="h-4 w-4 text-blue-600" /> Provider Operations
                </span>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase">Vendor Suite</Badge>
              </div>

              <div className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">01</span>
                  <div>
                    <strong className="text-foreground block">Inventory CRUD Control</strong>
                    <span>Add, update, or remove gear units from your active storefront catalog with custom image attachments.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">02</span>
                  <div>
                    <strong className="text-foreground block">Incoming Order Tracking</strong>
                    <span>Monitor reservation requests in real-time as customer payments are confirmed.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">03</span>
                  <div>
                    <strong className="text-foreground block">Status Progression</strong>
                    <span>Advance order fulfillment lifecycles by confirming requests, marking items picked up, and completing returns.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Moderation Card */}
            <div className="bg-card border border-border p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-bold text-foreground text-sm uppercase flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Admin Command Center
                </span>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase">Moderator Portal</Badge>
              </div>

              <div className="space-y-3 font-sans text-xs text-muted-foreground">
                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">01</span>
                  <div>
                    <strong className="text-foreground block">User Account Moderation</strong>
                    <span>View all registered customers and providers, reviewing role designations and instantly suspending or activating accounts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">02</span>
                  <div>
                    <strong className="text-foreground block">Global Inventory Audit</strong>
                    <span>Oversee all platform gear listings, rental transactions, and revenue metrics in one centralized view.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-muted p-3 border border-border">
                  <span className="font-mono font-bold text-foreground">03</span>
                  <div>
                    <strong className="text-foreground block">Category Taxonomy Management</strong>
                    <span>Create, modify, and organize platform categories to ensure seamless equipment classification.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-primary text-primary-foreground p-8 md:p-12 border border-border flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono text-primary-foreground/60 uppercase tracking-widest block">
              [ Ready to Experience GearUp? ]
            </span>
            <h3 className="text-2xl font-serif font-light tracking-tight text-primary-foreground">
              Test out the live gear directory and rental booking system.
            </h3>
            <p className="text-xs text-primary-foreground/80 font-sans max-w-md">
              Browse listings, test the cart flow, and explore integrated review handling directly on the platform.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-none bg-primary-foreground text-primary hover:opacity-90 text-xs font-mono uppercase px-6 h-11 flex items-center gap-2 border-none"
            >
              <Link href="/gear-items">
                Browse Directory <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}