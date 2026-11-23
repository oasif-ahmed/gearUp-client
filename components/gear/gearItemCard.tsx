"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUpRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  name,
  brand,
  images,
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

  const isAvailable = status === "AVAILABLE";

  // Card entrance animation
  useEffect(() => {
    if (cardRef.current) {
      import("@/lib/animations").then(({ animate }) => {
        if (cardRef.current) {
          animate(cardRef.current, {
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.97, 1],
            duration: 550,
            easing: "easeOutExpo",
          });
        }
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="gear-item-card group relative flex h-full flex-col overflow-hidden rounded-none border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg font-mono"
    >
      {/* Compact image area */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {/* Category tag */}
        <span className="absolute left-2.5 top-2.5 z-10 rounded-none bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-accent-foreground shadow-sm">
          {category?.name || "General"}
        </span>

        {/* Condition tag */}
        <Badge
          variant={conditionVariant(condition)}
          className="absolute left-2.5 top-8 z-10 rounded-none border-white/20 bg-black/55 px-1.5 py-0 text-[8px] uppercase tracking-wider text-white backdrop-blur-sm hover:bg-black/55"
        >
          {formatCondition(condition)}
        </Badge>

        {/* Availability dot */}
        <span
          title={isAvailable ? "Available" : "Unavailable"}
          className={`absolute right-2.5 top-2.5 z-10 flex h-4 w-4 items-center justify-center rounded-none border border-white/30 bg-black/55 backdrop-blur-sm ${
            isAvailable ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-none bg-current" />
        </span>

        {/* Hover affordance */}
        <span className="absolute bottom-2.5 right-2.5 z-20 flex h-6 w-6 translate-y-1 items-center justify-center rounded-none bg-primary text-primary-foreground opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>

        {/* Name sits on the image so more of the photo is visible */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent pb-2.5 pl-3 pr-10 pt-8">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-none bg-accent" />
            <span className="truncate text-[8px] uppercase tracking-[0.18em] text-white/70">
              {brand || "Standard Brand"}
            </span>
          </div>

          <h3
            className="mt-1 truncate font-serif text-[13px] font-semibold leading-tight text-white"
            title={name}
          >
            {name}
          </h3>
        </div>
      </div>

      {/* Compact card body */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5">
        <div>
          <div className="flex items-end justify-between gap-2 border-t border-border pt-2">
            <div>
              <p className="mb-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
                Rate / Day
              </p>
              <p className="text-[13px] font-bold leading-none text-foreground">
                {formatPrice(pricePerDay)}
                <span className="ml-0.5 text-[8px] font-normal text-muted-foreground">/d</span>
              </p>
            </div>
            <div className="text-right">
              <p className="mb-0.5 text-[8px] uppercase tracking-wider text-muted-foreground">
                Deposit
              </p>
              <p className="text-[11px] font-medium leading-none text-muted-foreground">
                {formatPrice(securityDeposit)}
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1">
              <Package className="h-2.5 w-2.5" />
              {quantity} left
            </span>
            <span className={isAvailable ? "text-emerald-500" : "text-destructive"}>
              {isAvailable ? "Ready to rent" : "Not available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GearItemCard;
