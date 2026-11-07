import React from "react";
import { Package, Tag } from "lucide-react";
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

  // Collect all available specification attributes dynamically
  const activeSpecs = Object.entries(specifications || {}).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  );

  return (
    <div className="group relative rounded-none border border-[#d8d2c6] dark:border-zinc-700 bg-[#ede8df] dark:bg-zinc-800 shadow-sm transition-all hover:border-[#2c2a29] dark:hover:border-zinc-100 hover:shadow-md overflow-hidden flex flex-col h-full font-mono">
      
      {/* 1. Compact Image Header Section */}
      <div className="relative h-40 w-full overflow-hidden bg-[#f4f1ea] dark:bg-zinc-900 shrink-0 border-b border-[#d8d2c6] dark:border-zinc-700">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          <Badge variant={conditionVariant(condition)} className="rounded-none text-[9px] uppercase font-mono px-1.5 py-0">
            {formatCondition(condition)}
          </Badge>
          <Badge variant={statusVariant(status)} className="rounded-none text-[9px] uppercase font-mono px-1.5 py-0">
            {status ? status.charAt(0) + status.slice(1).toLowerCase() : ""}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-[#ede8df]/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-mono uppercase font-bold text-[#2c2a29] dark:text-zinc-100 border border-[#d8d2c6] dark:border-zinc-700">
            {category?.name || "General"}
          </span>
        </div>
      </div>

      {/* 2. Packed Content Body */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2.5">
        
        {/* Title & Brand */}
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#6b655f] dark:text-zinc-400 uppercase tracking-wider">
            <span>{brand || "Standard Brand"}</span>
            <span>Ref #{id?.slice(-6)}</span>
          </div>

          <h3 className="text-sm font-bold text-[#2c2a29] dark:text-white line-clamp-1 group-hover:text-[#5a6b5c] transition-colors font-serif" title={name}>
            {name}
          </h3>

          <p className="text-[11px] text-[#6b655f] dark:text-zinc-300 line-clamp-1 leading-relaxed font-mono">
            {description || "No description provided."}
          </p>
        </div>

        {/* Dense 2x2 Specifications Grid (Shows up to 4 specs packed tightly) */}
        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-[#6b655f] dark:text-zinc-400 bg-[#f4f1ea] dark:bg-zinc-900 p-2 border border-[#d8d2c6] dark:border-zinc-700">
          {activeSpecs.length > 0 ? (
            activeSpecs.slice(0, 4).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1 truncate">
                <Tag className="h-2.5 w-2.5 shrink-0 text-[#5a6b5c]" />
                <span className="truncate capitalize font-mono text-[10px]">
                  <strong className="text-[#2c2a29] dark:text-zinc-200">{key}:</strong> {String(val)}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-[10px] text-[#a39c94] italic">
              Standard specifications apply
            </div>
          )}
        </div>

        {/* Financial & Inventory Footer */}
        <div className="pt-2 mt-auto border-t border-[#d8d2c6] dark:border-zinc-700 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-[#a39c94] uppercase font-mono">Rate / Deposit</p>
            <p className="text-xs font-bold text-[#2c2a29] dark:text-white font-mono">
              {formatPrice(pricePerDay)}<span className="text-[10px] font-normal text-[#6b655f]">/d</span>
              <span className="text-[10px] font-normal text-[#a39c94] ml-1">(Dep: {formatPrice(securityDeposit)})</span>
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#6b655f] dark:text-zinc-400 font-mono shrink-0">
            <Package className="h-3 w-3 text-[#5a6b5c]" />
            <span>{quantity} left</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GearItemCard;