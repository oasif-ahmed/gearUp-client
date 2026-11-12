"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Download, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { animate, createTimeline, onScroll } from "animejs";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"enterprise" | "growth">("growth");
  
  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const invoicePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial Page Load Animation (Staggered Reveal)
    const tl = createTimeline({
      defaults: {
        easing: "easeOutExpo",
      }
    });

    // Animate Badge
    if (badgeRef.current) {
      tl.add(badgeRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 800,
      });
    }

    // Animate Headline with Text Effect
    if (headlineRef.current) {
      tl.add(headlineRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
      }, "-=400");
    }

    // Animate Paragraph
    if (textRef.current) {
      tl.add(textRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
      }, "-=600");
    }

    // Animate Buttons
    if (buttonsRef.current) {
      tl.add(buttonsRef.current.children, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: (el: any, i: number) => i * 150,
      }, "-=400");
    }

    // Animate Trust Indicators
    if (trustRef.current) {
      tl.add(trustRef.current.children, {
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        delay: (el: any, i: number) => i * 100,
      }, "-=400");
    }

    // Animate Invoice Card Panel with Float Effect
    if (invoicePanelRef.current) {
      tl.add(invoicePanelRef.current, {
        opacity: [0, 1],
        translateX: [40, 0],
        rotate: [2, 0],
        duration: 1200,
      }, "-=1000");

      // Continuous Floating animation for Invoice card
      animate(invoicePanelRef.current, {
        translateY: [-6, 6],
        duration: 3000,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine"
      });
    }

    // 2. Scroll Animation Setup
    if (sectionRef.current) {
      onScroll({
        target: sectionRef.current,
        onUpdate: (self: any) => {
          // Subtle parallax on background or elements
          if (headlineRef.current) {
            animate(headlineRef.current, {
              translateY: self.progress * 30,
              duration: 0,
            });
          }
        }
      });
    }

  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-background py-16 lg:py-24 text-foreground font-mono text-xs border-b border-border overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Layout: Left Content & Right Invoice Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-8">
            <div ref={badgeRef} className="flex items-center gap-2 opacity-0">
              <Badge className="rounded-none bg-primary text-primary-foreground hover:bg-primary text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
                [ Automated Billing Layer ]
              </Badge>
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-mono">
                • V2.4 Engine Active
              </span>
            </div>

            <div className="space-y-4">
              <h1 
                ref={headlineRef} 
                className="text-4xl sm:text-6xl font-light tracking-tight text-foreground font-serif leading-[1.1] opacity-0"
              >
                The financial infrastructure for modern equipment logistics.
              </h1>
              <p 
                ref={textRef} 
                className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed font-sans pt-2 opacity-0"
              >
                Automate escrow settlements, multi-tier vendor payouts, and real-time invoice reconciliation with precision ledger tracking and zero manual friction.
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-none bg-primary text-primary-foreground hover:opacity-90 text-xs font-mono uppercase px-7 h-12 shadow-xs flex items-center gap-2 opacity-0"
              >
                <Link href="/register">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-border bg-card text-foreground hover:bg-accent text-xs font-mono uppercase px-6 h-12 opacity-0"
              >
                <Link href="/about">View Architecture</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div ref={trustRef} className="pt-6 border-t border-border grid grid-cols-3 gap-4 font-sans text-xs text-muted-foreground">
              <div className="flex items-center gap-2 opacity-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>PCI-DSS Level 1</span>
              </div>
              <div className="flex items-center gap-2 opacity-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Stripe & SSLCommerz</span>
              </div>
              <div className="flex items-center gap-2 opacity-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>99.99% Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Invoice Preview Panel */}
          <div className="lg:col-span-5">
            <div 
              ref={invoicePanelRef} 
              className="bg-card border border-border shadow-xl p-6 sm:p-8 space-y-6 relative opacity-0"
            >
              
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-foreground" />
                  <span className="font-bold uppercase text-xs tracking-wider text-foreground font-mono">
                    Invoice #INV-2026-089
                  </span>
                </div>
                <Badge variant="outline" className="rounded-none text-[9px] uppercase font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  Paid & Settled
                </Badge>
              </div>

              {/* Toggle Tier */}
              <div className="grid grid-cols-2 bg-muted p-1 border border-border">
                <button
                  onClick={() => setActiveTab("growth")}
                  className={`py-1.5 text-[10px] uppercase font-mono transition-all ${
                    activeTab === "growth" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Growth Tier
                </button>
                <button
                  onClick={() => setActiveTab("enterprise")}
                  className={`py-1.5 text-[10px] uppercase font-mono transition-all ${
                    activeTab === "enterprise" ? "bg-background text-foreground shadow-2xs font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Enterprise SLA
                </button>
              </div>

              {/* Line Items */}
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between py-2 border-b border-border text-muted-foreground">
                  <span>Manduka PRO Premium Yoga and Exercise Mat</span>
                  <span className="font-mono font-medium text-foreground">$1,450.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border text-muted-foreground">
                  <span>CAP Barbell 30kg Rubber Coated Hex Dumbbell Set</span>
                  <span className="font-mono font-medium text-foreground">$320.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border text-muted-foreground">
                  <span>Reebok Professional Adjustable Weight Bench</span>
                  <span className="font-mono font-medium text-foreground">$21.84</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-background p-4 border border-border space-y-2 font-mono">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Subtotal</span>
                  <span>$1,791.84</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border">
                  <span>Total Due</span>
                  <span className="text-emerald-600">$1,791.84 USD</span>
                </div>
              </div>

              {/* Panel Footer Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-muted-foreground font-mono">Generated via Stripe Connect</span>
                <button className="inline-flex items-center gap-1.5 text-[11px] font-mono text-foreground hover:underline font-semibold">
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
