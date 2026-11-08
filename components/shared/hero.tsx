"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Download, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"enterprise" | "growth">("growth");

  return (
    <section className="relative bg-[#FDFBF7] py-16 lg:py-24 text-zinc-900 font-mono text-xs border-b border-zinc-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Layout: Left Content & Right Invoice Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-2">
              <Badge className="rounded-none bg-zinc-900 text-white hover:bg-zinc-900 text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
                [ Automated Billing Layer ]
              </Badge>
              <span className="text-[10px] uppercase text-zinc-400 tracking-wider font-mono">
                • V2.4 Engine Active
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-zinc-900 font-serif leading-[1.1]">
                The financial infrastructure for modern equipment logistics.
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed font-sans pt-2">
                Automate escrow settlements, multi-tier vendor payouts, and real-time invoice reconciliation with precision ledger tracking and zero manual friction.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-7 h-12 shadow-xs flex items-center gap-2"
              >
                <Link href="/register">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 text-xs font-mono uppercase px-6 h-12"
              >
                <Link href="/about">View Architecture</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-zinc-200/80 grid grid-cols-3 gap-4 font-sans text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>PCI-DSS Level 1</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Stripe & SSLCommerz</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>99.99% Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Invoice Preview Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-300 shadow-xl p-6 sm:p-8 space-y-6 relative">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-900" />
                  <span className="font-bold uppercase text-xs tracking-wider text-zinc-900 font-mono">
                    Invoice #INV-2026-089
                  </span>
                </div>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase font-mono bg-emerald-50 text-emerald-700 border-emerald-200">
                  Paid & Settled
                </Badge>
              </div>

              {/* Toggle Tier */}
              <div className="grid grid-cols-2 bg-zinc-100 p-1 border border-zinc-200">
                <button
                  onClick={() => setActiveTab("growth")}
                  className={`py-1.5 text-[10px] uppercase font-mono transition-all ${
                    activeTab === "growth" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Growth Tier
                </button>
                <button
                  onClick={() => setActiveTab("enterprise")}
                  className={`py-1.5 text-[10px] uppercase font-mono transition-all ${
                    activeTab === "enterprise" ? "bg-white text-zinc-900 shadow-2xs font-bold" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Enterprise SLA
                </button>
              </div>

              {/* Line Items */}
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between py-2 border-b border-zinc-100 text-zinc-600">
                  <span>Manduka PRO Premium Yoga and Exercise Mat</span>
                  <span className="font-mono font-medium text-zinc-900">$1,450.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 text-zinc-600">
                  <span>CAP Barbell 30kg Rubber Coated Hex Dumbbell Set</span>
                  <span className="font-mono font-medium text-zinc-900">$320.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 text-zinc-600">
                  <span>Reebok Professional Adjustable Weight Bench</span>
                  <span className="font-mono font-medium text-zinc-900">$21.84</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-[#FDFBF7] p-4 border border-zinc-200 space-y-2 font-mono">
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>Subtotal</span>
                  <span>$1,791.84</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                  <span>Total Due</span>
                  <span className="text-emerald-600">$1,791.84 USD</span>
                </div>
              </div>

              {/* Panel Footer Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-zinc-400 font-mono">Generated via Stripe Connect</span>
                <button className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-900 hover:underline font-semibold">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}