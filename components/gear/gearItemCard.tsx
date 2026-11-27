"use client";

import React, { useRef, useEffect } from "react";
import { Package, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { floatElement, animate, animationPresets } from "@/lib/animations";

interface GearItemCardProps {
  id: string;
  name: string;
  description: string;
  brand: string;
  images: string[];
  specifications: {
    color?: string;
    weight?: string;
    seasons?: number;
    capacity?: number;
    material?: string;
    setupTime?: string;
    dimensions?: string;
    waterproof?: boolean;
    [key: string]: any;
  };
  condition: string;
  pricePerDay: string | number;
  securityDeposit: string | number;
  quantity: number;
  status: string;
  category: {
    name: string;
    description?: string;
    image?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

const GearItemCard: React.FC<GearItemCardProps> = ({
  id,
  name,
  description,
  brand,
  images,
  specifications = {},
  condition,
  pricePerDay,
  securityDeposit,
  quantity,
  status,
  category,
}) => {
  const imageUrl = images?.[0] || "/placeholder-gear.jpg";
  const cardRef = useRef<HTMLDivElement>(null);

  const formatCondition = (cond: string) => {
    return cond ? cond.charAt(0) + cond.slice(1).toLowerCase() : "";
  };

  const formatPrice = (price: string | number) => {
    return `৳${price}`;
  };

  const conditionVariant = (cond: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (cond) {
      case "NEW": return "default";
      case "GOOD": return "secondary";
      case "FAIR": return "outline";
      case "POOR": return "destructive";
      default: return "outline";
    }
  };

  const statusVariant = (stat: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (stat) {
      case "AVAILABLE": return "default";
      case "UNAVAILABLE": return "destructive";
      case "MAINTENANCE": return "secondary";
      default: return "outline";
    }
  };

  // Collect all available specification attributes dynamically
  const activeSpecs = Object.entries(specifications || {}).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  );

  // Card entrance animation
  useEffect(() => {
    if (cardRef.current) {
      // Staggered entrance animation
      import("@/lib/animations").then(({ animate, animationPresets }) => {
        animate(cardRef.current!, {
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.95, 1],
          duration: 700,
          easing: "easeOutExpo",
        });
      });
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group relative rounded-none border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary overflow-hidden flex flex-col h-full font-mono"
    >
      
      {/* 1. Full Image Cover Background */}
      <div className="relative h-72 w-full overflow-hidden bg-muted shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <Badge className="rounded-none text-[9px] uppercase font-mono px-2 py-0.5 bg-background text-foreground border-none">
            {formatCondition(condition)}
          </Badge>
          <div className="bg-primary px-2 py-0.5 text-[9px] font-mono uppercase font-bold text-primary-foreground">
            {category?.name || "General"}
          </div>
        </div>

        {/* 2. Content Overlay with Gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">

          {/* Brand & Title */}
          <div className="space-y-0.5 mb-2">
            <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest block">
              {brand || "Standard Brand"}
            </span>
            <h3 className="text-base font-bold text-white line-clamp-1 font-serif uppercase tracking-tight" title={name}>
              {name}
            </h3>
          </div>

          {/* Details (Always visible) */}
          <p className="text-[10px] text-white/90 line-clamp-2 font-mono leading-relaxed mb-3">
            {description || "Premium gear available for immediate rental."}
          </p>

          {/* Price & Inventory Footer */}
          <div className="pt-2 border-t border-white/20 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[9px] text-white/60 uppercase font-mono leading-none mb-1">Rate / Deposit</p>
              <p className="text-xs font-bold text-white font-mono leading-none">
                {formatPrice(pricePerDay)}<span className="text-[9px] font-normal text-white/70">/d</span>
                <span className="text-[9px] font-normal text-white/60 ml-1">({formatPrice(securityDeposit)})</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/90 uppercase font-mono">
              <Package className="h-3 w-3 text-primary" />
              <span>{quantity}</span>
            </div>
          </div>
        </div>

        {/* Status indicator bar at the very bottom */}
        <div className={`absolute bottom-0 left-0 w-full h-1 z-20 transition-colors ${
          status === "AVAILABLE" ? "bg-emerald-500" : "bg-destructive"
        }`} />
      </div>
    </div>
  );
};

export default GearItemCard;