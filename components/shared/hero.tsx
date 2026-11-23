"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

    // Animate Gear Showcase Panel with Float Effect
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
      className="roboto-text relative bg-background py-16 lg:py-24 text-foreground font-mono text-xs border-b border-border overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Layout: Left Content & Right Invoice Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-6 space-y-8">
            <div ref={badgeRef} className="opacity-0">
              <Badge className="rounded-none bg-primary text-primary-foreground hover:bg-primary text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
                [ Gear Rental, Simplified ]
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 
                ref={headlineRef} 
                className="text-4xl sm:text-6xl font-medium tracking-tight text-foreground font-serif leading-[1.1] opacity-0"
              >
                Professional gear for every adventure.
              </h1>
              <p 
                ref={textRef} 
                className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed font-sans pt-2 opacity-0"
              >
                Find the best sports gear without the big price tag. Browse verified equipment, compare clear daily rates, and reserve in seconds — so you get quality kit for less and spend more time outside.
              </p>
            </div>

            <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="rounded-none bg-primary text-primary-foreground hover:opacity-90 text-xs font-mono uppercase px-7 h-12 shadow-xs flex items-center gap-2 opacity-0"
              >
                <Link href="/gear-items">
                  Browse Gear <ArrowRight className="h-4 w-4" />
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
          </div>

          {/* Right Column: structured product gallery, no card */}
          <div className="lg:col-span-6">
            <div
              ref={gearPanelRef}
              className="relative mx-auto grid w-full max-w-2xl grid-cols-2 items-end gap-x-5 gap-y-1 opacity-0"
            >
              {/* Centered shadow grounds the product without a card */}
              <div className="pointer-events-none absolute inset-x-10 bottom-4 h-12 rounded-full bg-black/10 blur-2xl" />

              {/* Main angle - full width row */}
              <img
                src="/gear-showcase/dumbbell-tilted.png"
                alt="Adjustable dumbbell, tilted view"
                className="col-span-2 w-full origin-bottom scale-[1.25] object-contain drop-shadow-[0_26px_22px_rgba(0,0,0,0.22)] transition-transform duration-700 hover:scale-[1.3]"
              />

              {/* Supporting angles - equal columns, shared baseline */}
              <img
                src="/gear-showcase/dumbbell-front.png"
                alt="Adjustable dumbbell, front view"
                className="w-full origin-bottom scale-[1.15] object-contain drop-shadow-[0_18px_16px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.2]"
              />
              <img
                src="/gear-showcase/dumbbell-side.png"
                alt="Adjustable dumbbell, side view"
                className="w-full origin-bottom scale-[1.15] object-contain drop-shadow-[0_18px_16px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-[1.2]"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}