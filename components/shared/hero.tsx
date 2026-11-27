"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  createTimeline, 
  floatElement, 
  animate, 
  animationPresets, 
  staggerElements 
} from "@/lib/animations";
import { onScroll } from "animejs";

export default function Hero() {
  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const gearPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initial Page Load Animation (Staggered Reveal)
    const tl = createTimeline({
      defaults: {
        duration: 800,
      }
    });

    // Animate Badge
    if (badgeRef.current) {
      tl.add(badgeRef.current, {
        ...animationPresets.fadeIn,
        translateY: -20,
        duration: 800,
      });
    }

    // Animate Headline with Text Effect
    if (headlineRef.current) {
      tl.add(headlineRef.current, {
        ...animationPresets.slideUp,
        duration: 1000,
      }, "-=400");
    }

    // Animate Paragraph
    if (textRef.current) {
      tl.add(textRef.current, {
        ...animationPresets.slideUp,
        duration: 800,
      }, "-=600");
    }

    // Animate Buttons
    if (buttonsRef.current) {
      staggerElements(buttonsRef.current.children as unknown as Element[], 'normal', {
        ...animationPresets.slideUp,
        duration: 600,
      });
    }

    // Animate Trust Indicators
    if (trustRef.current) {
      staggerElements(trustRef.current.children as unknown as Element[], 'normal', {
        ...animationPresets.cardEnter,
        scale: [0.9, 1],
        duration: 600,
      });
    }

    // Animate Gear Showcase with Float Effect
    if (gearPanelRef.current) {
      animate(gearPanelRef.current, {
        ...animationPresets.cardEnter,
        translateX: [40, 0],
        rotate: [2, 0],
        duration: 1200,
      });

      floatElement(gearPanelRef.current, 6, 3000);
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
                [ Sports Gear Rental Hub ]
              </Badge>
              <span className="text-[10px] uppercase text-muted-foreground tracking-wider font-mono">
                • Inventory Live & Ready
              </span>
            </div>

            <div className="space-y-4">
              <h1 
                ref={headlineRef} 
                className="text-4xl sm:text-6xl font-light tracking-tight text-foreground font-serif leading-[1.1] opacity-0"
              >
                Rent professional-grade outdoor and sports equipment instantly.
              </h1>
              <p 
                ref={textRef} 
                className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed font-sans pt-2 opacity-0"
              >
                Access top-tier gear for your next adventure. Browse a curated selection of reliable equipment with secure reservations and frictionless fulfillment.
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-none bg-primary text-primary-foreground hover:opacity-90 text-xs font-mono uppercase px-7 h-12 shadow-xs flex items-center gap-2 opacity-0"
              >
                <Link href="/gear-items">
                  Browse Catalog <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-border bg-card text-foreground hover:bg-accent text-xs font-mono uppercase px-6 h-12 opacity-0"
              >
                <Link href="/about">How It Works</Link>
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

          {/* Right Column: Previous gear item showcase */}
          <div className="lg:col-span-5">
            <div
              ref={gearPanelRef}
              className="relative mx-auto grid w-full max-w-xl grid-cols-2 items-end gap-x-5 gap-y-1 opacity-0"
            >
              <div className="pointer-events-none absolute inset-x-10 bottom-4 h-12 rounded-none bg-black/10 blur-2xl" />

              <Image
                src="/gear-showcase/dumbbell-tilted.png"
                alt="Adjustable dumbbell, tilted view"
                width={1800}
                height={1014}
                priority
                className="col-span-2 h-auto w-full origin-bottom scale-[1.25] object-contain drop-shadow-[0_26px_22px_rgba(0,0,0,0.22)] transition-transform duration-700 hover:scale-[1.3]"
              />

              <Image
                src="/gear-showcase/dumbbell-front.png"
                alt="Adjustable dumbbell, front view"
                width={1800}
                height={1014}
                className="h-auto w-full origin-bottom scale-[1.15] object-contain drop-shadow-[0_18px_16px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.2]"
              />

              <Image
                src="/gear-showcase/dumbbell-side.png"
                alt="Adjustable dumbbell, side view"
                width={1800}
                height={1014}
                className="h-auto w-full origin-bottom scale-[1.15] object-contain drop-shadow-[0_18px_16px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.2]"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}