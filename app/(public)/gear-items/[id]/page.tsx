
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGearItemById } from "@/services/gear-item.service";
import {
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Layers,
  Calendar,
  PackageCheck,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import Loading from "../loading";

export default function GearItemDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [gearItem, setGearItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Track how many units of this item are already in the cart
  const [cartQuantity, setCartQuantity] = useState(0);

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
          setSelectedImage(
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load gear item details",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  // Read the current item's quantity from localStorage
  useEffect(() => {
    if (!gearItem?.id) return;

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("gearup_cart") || "[]",
      );

      const existingItem = Array.isArray(existingCart)
        ? existingCart.find(
            (item: any) => item.gearItemId === gearItem.id,
          )
        : null;

      setCartQuantity(Number(existingItem?.quantity) || 0);
    } catch {
      setCartQuantity(0);
    }
  }, [gearItem?.id]);

  // Handle adding item to client-side localStorage cart
  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("gearup_cart") || "[]",
      );

      if (!Array.isArray(existingCart)) {
        toast.error("Invalid cart data. Please refresh the page.");
        return;
      }

      const existingItem = existingCart.find(
        (item: any) => item.gearItemId === gearItem.id,
      );

      const currentQuantity = Number(existingItem?.quantity) || 0;
      const availableQuantity = Number(gearItem.quantity) || 0;

      // Check whether the requested quantity exceeds inventory
      if (
        gearItem.status !== "AVAILABLE" ||
        currentQuantity >= availableQuantity
      ) {
        toast.error("Not enough items available!");
        return;
      }

      if (existingItem) {
        existingItem.quantity = currentQuantity + 1;
      } else {
        existingCart.push({
          gearItemId: gearItem.id,
          quantity: 1,
          startDate: "",
          endDate: "",
        });
      }

      localStorage.setItem("gearup_cart", JSON.stringify(existingCart));

      // Update the displayed remaining inventory
      setCartQuantity(currentQuantity + 1);

      toast.success(`${gearItem.name} added to your rental cart!`);
    } catch (err) {
      toast.error("Failed to update cart storage.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !gearItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center rounded-none border-zinc-200 shadow-xs">
          <CardHeader className="space-y-2">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
            <CardTitle className="text-lg font-mono uppercase tracking-tight">
              Item Not Found
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              {error ||
                "The requested rental gear item could not be located in our inventory."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              asChild
              size="sm"
              className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase"
            >
              <Link href="/gear-items">Return to Gear Directory</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const images =
    gearItem.images?.length > 0 ? gearItem.images : [selectedImage];

  const specs = gearItem.specifications || {};
  const specEntries = Object.entries(specs);

  // Calculate remaining inventory for this customer's cart
  const availableQuantity = Number(gearItem.quantity) || 0;

  const remainingQuantity = Math.max(
    0,
    availableQuantity - cartQuantity,
  );

  const isOutOfStock =
    gearItem.status !== "AVAILABLE" || remainingQuantity <= 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 text-zinc-900">
      {/* Editorial Header / Navigation */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <Link
            href="/gear-items"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400">
              REF: #{gearItem.id?.slice(-8) || "ITEM-001"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Top Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Media Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-zinc-200 p-6 shadow-xs">
            <div className="relative w-full flex-1 min-h-[380px] overflow-hidden bg-muted mb-4">
              <img
                src={selectedImage}
                alt={gearItem.name}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge className="rounded-none bg-zinc-900 text-white hover:bg-zinc-900 text-[10px] font-mono uppercase px-2 py-0.5">
                  {gearItem.category?.name || "Equipment"}
                </Badge>
                <Badge
                  variant="outline"
                  className={`rounded-none text-[10px] font-mono uppercase px-2 py-0.5 border ${
                    gearItem.status === "AVAILABLE"
                      ? "border-green-600 text-green-700 bg-green-50"
                      : "border-red-600 text-red-700 bg-red-50"
                  }`}
                >
                  {gearItem.status}
                </Badge>
              </div>
            </div>

            {/* Thumbnails Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pt-2 border-t border-zinc-100">
                {images.map((img: string, i: number) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 shrink-0 border transition-all ${
                        isSelected
                          ? "border-zinc-900 ring-1 ring-zinc-900"
                          : "border-zinc-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`view-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Invoice Summary & Reservation Box */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-zinc-200 p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  {gearItem.brand}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-xs font-mono uppercase text-zinc-500">
                  Condition: {gearItem.condition || "Standard"}
                </span>
              </div>
              <h1 className="text-2xl font-normal tracking-tight text-zinc-900 mb-3">
                {gearItem.name}
              </h1>
              <p className="text-xs text-zinc-600 leading-relaxed border-b border-zinc-100 pb-6 line-clamp-3">
                {gearItem.description}
              </p>
            </div>

            {/* Rental Rates Breakdown */}
            <div className="space-y-3 bg-[#FDFBF7] p-4 border border-zinc-200/80 font-mono text-xs my-4">
              <div className="flex justify-between items-center text-zinc-600">
                <span>Daily Rental Fee</span>
                <span className="text-sm font-bold text-zinc-900">
                  ৳{gearItem.pricePerDay}
                </span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                <span>Security Deposit (Refundable)</span>
                <span>৳{gearItem.securityDeposit}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 text-[11px] border-t border-zinc-200/60 pt-2">
                <span>Inventory Status</span>
                <span className="text-zinc-900 font-semibold">
                  {remainingQuantity} units available
                </span>
              </div>
            </div>

            {/* Action Group */}
            <div className="space-y-2 pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider h-11 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock
                  ? "Out of Stock"
                  : `Add to Cart — ৳${gearItem.pricePerDay}/Day`}
              </Button>
              <p className="text-[10px] font-mono text-zinc-400 text-center">
                Zero hidden fees. Deposit released upon return verification.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Clean Technical Specs & Dynamic Policy Rules */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          {/* Dynamic Technical Specifications */}
          <div className="md:col-span-7 bg-white border border-zinc-200 p-8 shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-900 font-semibold mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Layers className="h-4 w-4 text-zinc-700" /> Technical
              Specifications
            </h2>

            {specEntries.length > 0 ? (
              <div className="divide-y divide-zinc-100 font-mono text-xs">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="py-2.5 flex justify-between items-center gap-4"
                  >
                    <span className="text-zinc-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-zinc-900 font-medium text-right">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-zinc-400 italic">
                No extra technical parameters specified for this unit.
              </p>
            )}
          </div>

          {/* Dynamic Rental Protections & Return Workflow */}
          <div className="md:col-span-5 bg-white border border-zinc-200 p-8 shadow-xs">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-900 font-semibold mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-zinc-700" /> Terms &
              Safeguards
            </h2>

            <div className="space-y-4 text-xs text-zinc-600">
              <div className="flex items-start gap-3">
                <PackageCheck className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">
                    Verified Equipment
                  </p>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Inspected for standard operation in{" "}
                    <span className="text-zinc-900 uppercase font-mono font-medium">
                      {gearItem.condition || "Standard"}
                    </span>{" "}
                    state prior to handoff.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">
                    Instant Deposit Settlement
                  </p>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Your ৳{gearItem.securityDeposit} deposit is held securely
                    and refunded upon physical return check.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">
                    Flexible Duration
                  </p>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">
                    Daily billing starts on pick-up day. Early returns or
                    extensions managed directly in dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
