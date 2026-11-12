
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Story {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  gearUsed: string;
  verified: boolean;
}

const defaultStories: Story[] = [
  {
    id: "1",
    quote:
      "GearUp made sourcing high-end camera rigs for our documentary shoot seamless. Deposit settlement was instantaneous and equipment condition was immaculate.",
    author: "Alex Morgan",
    role: "Lead Cinematographer, Studio Nine",
    rating: 5,
    gearUsed: "RED Komodo 6K Kit & Anamorphic Lenses",
    verified: true,
  },
  {
    id: "2",
    quote:
      "Listing our expedition tents and climbing inventory as a provider generated steady revenue during off-season months. The platform moderation gives total confidence.",
    author: "Marcus Vance",
    role: "Operations Director, Alpine Outpost",
    rating: 5,
    gearUsed: "Mountain Hardwear Trango 3 Tents",
    verified: true,
  },
  {
    id: "3",
    quote:
      "The date-range booking synchronization eliminated our fear of double-booking. We picked up the cinema drone setup right on schedule.",
    author: "Elena Rostova",
    role: "Freelance Drone Operator",
    rating: 5,
    gearUsed: "DJI Inspire 3 Cinema Package",
    verified: true,
  },
];

export default function SocialProof({
  stories = defaultStories,
}: {
  stories?: Story[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-rotate stories every 7 seconds
  useEffect(() => {
    if (stories.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [stories.length]);

  // Keep the index valid if stories change
  useEffect(() => {
    setCurrentIndex((prev) =>
      stories.length > 0 ? prev % stories.length : 0
    );
  }, [stories.length]);

  // Animate content change
  useEffect(() => {
    if (contentRef.current) {
      import("@/lib/animations").then(({ animate }) => {
        if (!contentRef.current) return;

        animate(contentRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.98, 1],
          duration: 500,
          easing: "easeOutExpo",
        });
      });
    }
  }, [currentIndex]);

  // Handle empty stories
  if (stories.length === 0) {
    return null;
  }

  const current = stories[currentIndex];

  // Previous story
  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + stories.length) % stories.length
    );
  };

  // Next story
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <section className="bg-card border-y border-border py-20 text-foreground font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-6 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="rounded-none bg-primary text-primary-foreground hover:bg-primary text-[10px] uppercase tracking-widest px-2.5 py-1 font-mono">
                [ Verified Testimonials ]
              </Badge>

              <span className="text-[10px] uppercase text-muted-foreground tracking-wider">
                • Real Rental Feedback
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-light text-foreground tracking-tight">
              Customer Story Spotlight
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground mr-2 font-mono">
              0{currentIndex + 1} / 0{stories.length}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-none border-border h-9 w-9 hover:bg-accent text-foreground transition-all duration-200 hover:scale-110"
              aria-label="Previous story"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-none border-border h-9 w-9 hover:bg-accent text-foreground transition-all duration-200 hover:scale-110"
              aria-label="Next story"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rotating Content Box */}
        <div
          ref={contentRef}
          className="bg-background border border-border p-8 sm:p-12 relative shadow-xs transition-all duration-500"
        >
          <Quote className="h-10 w-10 text-muted-foreground absolute top-6 right-6 pointer-events-none" />

          <div className="space-y-6 max-w-4xl">
            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}

              {current.verified && (
                <Badge
                  variant="outline"
                  className="ml-3 rounded-none text-[9px] uppercase font-mono border-emerald-500/20 text-emerald-600 bg-emerald-500/10"
                >
                  Verified Renter
                </Badge>
              )}
            </div>

            {/* Quote Statement */}
            <blockquote className="text-lg sm:text-2xl font-serif font-light leading-relaxed text-foreground animate-fade-in-up">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            {/* Author & Context Footer */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-bold text-foreground text-sm block font-sans">
                  {current.author}
                </span>

                <span className="text-muted-foreground text-[11px] font-mono block">
                  {current.role}
                </span>
              </div>

              <div className="bg-card border border-border px-3 py-1.5 text-[11px] font-mono text-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />

                <span>
                  Verified Item:{" "}
                  <strong className="text-foreground">
                    {current.gearUsed}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
