"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGearItemById } from "@/services/gear-item.service";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  ShieldCheck,
  Layers,
  Activity,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Loading from "../loading";

export default function GearItemDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [gearItem, setGearItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    
    async function fetchItem() {
      try {
        setLoading(true);
        const response = await getGearItemById(id);
        const item = response?.gearItem || response;
        setGearItem(item);
        
        // Set initial primary image
        if (item?.images && item.images.length > 0) {
          setSelectedImage(item.images[0]);
        } else {
          setSelectedImage("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load gear item details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  if (loading) {
    return (
       <Loading></Loading>
    );
  }

  if (error || !gearItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-2">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <CardTitle className="text-xl font-bold">Item Not Found</CardTitle>
            <CardDescription className="text-xs">
              {error || "The requested item could not be found."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link href="/gear-items">Browse All Gear Items</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const images = gearItem.images?.length > 0 ? gearItem.images : [selectedImage];

  return (
    <div className="min-h-screen bg-background py-6 text-foreground">
      {/* Tight Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            href="/gear-items"
            className="flex items-center gap-1 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            Gear Items
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{gearItem.name}</span>
        </nav>
      </div>

      {/* Main Dense Command-Center Container */}
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        
        {/* Top Split: Image Preview + Primary Dense Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Column: Image Card with Working Interactive Thumbnails */}
          <Card className="lg:col-span-5 overflow-hidden border-border bg-card flex flex-col justify-between">
            <div className="relative bg-muted aspect-4/3 lg:aspect-square overflow-hidden group">
              <img
                src={selectedImage}
                alt={gearItem.name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <Badge variant="default" className="text-[10px] px-2 py-0.5 shadow">
                  {gearItem.category?.name || "Equipment"}
                </Badge>
                <Badge
                  variant={gearItem.status === "AVAILABLE" ? "secondary" : "destructive"}
                  className="text-[10px] px-2 py-0.5 shadow"
                >
                  {gearItem.status}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Strip with Click Handler */}
            {images.length > 1 && (
              <div className="p-2 bg-muted/40 flex gap-2 overflow-x-auto border-t border-border">
                {images.map((img: string, i: number) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded overflow-hidden shrink-0 transition-all border-2 ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 scale-95"
                          : "border-border opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Right Column: High-Density Quick Metadata & Pricing Hub */}
          <Card className="lg:col-span-7 border-border bg-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    ID: {gearItem.id?.slice(-6) || "PRO-01"}
                  </span>
                  <h1 className="text-2xl font-bold tracking-tight mt-1">
                    {gearItem.name}
                  </h1>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-muted-foreground block">Daily Rate</span>
                  <span className="text-xl font-bold text-primary">৳{gearItem.pricePerDay}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                {gearItem.description}
              </p>

              {/* Data Matrix / Grid of Meta info */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Brand</span>
                  <span className="text-xs font-semibold">{gearItem.brand}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Condition</span>
                  <span className="text-xs font-semibold">{gearItem.condition || "Standard"}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border">
                  <span className="text-[10px] text-muted-foreground block">Deposit</span>
                  <span className="text-xs font-semibold">৳{gearItem.securityDeposit}</span>
                </div>
              </div>

              {/* Inventory Level Tracker */}
              <div className="p-3 rounded bg-muted/30 border border-border mb-4 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium flex items-center gap-1">
                    <Activity className="h-3 w-3 text-primary" /> Stock Availability
                  </span>
                  <span className="font-bold">{gearItem.quantity} units ready</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min((gearItem.quantity || 1) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">Rent Now (৳{gearItem.pricePerDay}/day)</Button>
              <Button size="sm" variant="outline">Wishlist</Button>
            </div>
          </Card>
        </div>

        {/* Bottom Section: Compact Multi-Column Specs & Features Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Technical Specs Card */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" /> Technical Specs
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {gearItem.specifications && Object.keys(gearItem.specifications).length > 0 ? (
                Object.entries(gearItem.specifications).map(([key, value]) => (
                  <div key={key} className="p-2 rounded bg-muted/30 border border-border text-xs flex flex-col">
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium truncate">{String(value)}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-muted-foreground col-span-2">No specs available.</span>
              )}
            </div>
          </Card>

          {/* Key Features Pill Matrix */}
          <Card className="border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Key Features & Perks
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Professional Grade",
                "Easy Assembly",
                "Durable Build",
                "Weather Resistant",
                "Ergonomic Design",
                "Lightweight Frame",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 p-2 rounded bg-muted/30 border border-border text-xs">
                  <Check className="h-3 w-3 text-green-600 shrink-0" />
                  <span className="truncate font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}