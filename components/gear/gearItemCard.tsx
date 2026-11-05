import React from "react";
import { Star, MapPin, Calendar, Shield, Package, Tag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    [key: string]: any; // fallback for dynamic spec keys
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

  return (
    <div className="group relative rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg overflow-hidden flex flex-col justify-between">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-muted shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={conditionVariant(condition)}>
            {formatCondition(condition)}
          </Badge>
          <Badge variant={statusVariant(status)}>
            {status ? status.charAt(0) + status.slice(1).toLowerCase() : ""}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-background/90 backdrop-blur-sm px-3 py-1 text-sm font-semibold rounded-full text-foreground">
            {category?.name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Header */}
          <div className="mb-3">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider">{brand}</span>
            <h3 className="text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            {/* 🛑 CLAMPED DESCRIPTION TO 2 LINES */}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            {specifications.color && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{specifications.color}</span>
              </div>
            )}
            {specifications.capacity && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Package className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{specifications.capacity}P Capacity</span>
              </div>
            )}
            {specifications.seasons && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{specifications.seasons} Season</span>
              </div>
            )}
            {typeof specifications.waterproof === "boolean" && (
              <div className="flex items-center gap-1.5 text-muted-foreground truncate">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{specifications.waterproof ? "Waterproof" : "Not Waterproof"}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          {/* Price Section */}
          <div className="border-t border-border pt-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase font-mono">Daily Rate</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrice(pricePerDay)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground uppercase font-mono">Deposit</p>
                <p className="text-sm font-semibold text-card-foreground">
                  {formatPrice(securityDeposit)}
                </p>
              </div>
            </div>
          </div>

          {/* Quantity & Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Package className="h-3.5 w-3.5" />
              <span>{quantity} in stock</span>
            </div>
            <Button size="sm">Rent Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GearItemCard;