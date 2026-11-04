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
    color: string;
    weight: string;
    seasons: number;
    capacity: number;
    material: string;
    setupTime: string;
    dimensions: string;
    waterproof: boolean;
  };
  condition: string;
  pricePerDay: string;
  securityDeposit: string;
  quantity: number;
  status: string;
  category: {
    name: string;
    description?: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const GearItemCard: React.FC<GearItemCardProps> = ({
  id,
  name,
  description,
  brand,
  images,
  specifications,
  condition,
  pricePerDay,
  securityDeposit,
  quantity,
  status,
  category,
  createdAt,
  updatedAt,
}) => {
  const imageUrl = images?.[0] || "/placeholder-gear.jpg";

  const formatCondition = (condition: string) => {
    return condition.charAt(0) + condition.slice(1).toLowerCase();
  };

  const formatPrice = (price: string) => {
    return `৳${price}`;
  };

  const conditionVariant = (condition: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (condition) {
      case "NEW": return "default";
      case "GOOD": return "secondary";
      case "FAIR": return "outline";
      case "POOR": return "destructive";
      default: return "outline";
    }
  };

  const statusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "AVAILABLE": return "default";
      case "UNAVAILABLE": return "destructive";
      case "MAINTENANCE": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="group relative rounded-lg border bg-card shadow-sm transition-all hover:shadow-lg overflow-hidden">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-muted">
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
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-background/90 backdrop-blur-sm px-3 py-1 text-sm font-semibold rounded-full text-foreground">
            {category.name}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {brand} • {description}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>{specifications.color}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{specifications.capacity}P</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>{specifications.seasons} Season</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{specifications.waterproof ? "Waterproof" : "Not WP"}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="border-t border-border pt-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Rate</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(pricePerDay)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Deposit</p>
              <p className="text-lg font-semibold text-card-foreground">
                {formatPrice(securityDeposit)}
              </p>
            </div>
          </div>
        </div>

        {/* Quantity & Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{quantity} in stock</span>
          </div>
          <Button>Rent Now</Button>
        </div>
      </div>
    </div>
  );
};

export default GearItemCard;