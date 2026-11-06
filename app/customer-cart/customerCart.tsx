"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowUpRight,
  X,
  Package,
  Calendar,
  ShieldCheck,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CustomerCart({
  rentalOrders = [],
  gearItems = [],
  createRentalOrderAction,
  cancelRentalOrderAction,
  getRentalOrderDetailsAction,
}: {
  rentalOrders: any[];
  gearItems: any[];
  createRentalOrderAction: (payload: any) => Promise<any>;
  cancelRentalOrderAction: (orderId: string) => Promise<any>;
  getRentalOrderDetailsAction: (orderId: string) => Promise<any>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "cart">("orders");

  // Cart state
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Global rental dates
  const [globalStartDate, setGlobalStartDate] = useState<string>("");
  const [globalEndDate, setGlobalEndDate] = useState<string>("");

  // Loading states
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);

  // Load cart items from localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("gearup_cart") || "[]");

      setCartItems(savedCart);
    } catch (err) {
      console.error("Failed to parse cart storage:", err);
    }
  }, []);

  // Sync cart state and localStorage
  const syncCartStorage = (updatedCart: any[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("gearup_cart", JSON.stringify(updatedCart));
  };

  // Find gear details
  const getGearDetails = (gearItemId: string) => {
    return gearItems.find((gear: any) => gear.id === gearItemId);
  };

  // Rental order progress
  const getStatusStep = (status: string) => {
    switch (status) {
      case "PLACED":
        return 25;
      case "CONFIRMED":
        return 50;
      case "PICKED_UP":
        return 75;
      case "RETURNED":
        return 100;
      default:
        return 10;
    }
  };

  // Rental status badge
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "RETURNED":
        return "secondary";
      case "PICKED_UP":
        return "default";
      case "CONFIRMED":
        return "outline";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Update URL without triggering a Next.js navigation
  const updateOrderUrl = (orderId?: string) => {
    const params = new URLSearchParams(window.location.search);

    if (orderId) {
      params.set("id", orderId);
    } else {
      params.delete("id");
    }

    const queryString = params.toString();

    const newUrl = queryString
      ? `/customer-cart?${queryString}`
      : "/customer-cart";

    window.history.pushState(null, "", newUrl);
  };

  // Fetch rental order details and open invoice
  const handleViewOrderDetails = async (orderId: string) => {
    // Prevent duplicate clicks for the same loading request
    if (loadingInvoiceId) return;

    try {
      setLoadingInvoiceId(orderId);

      // Update URL
      updateOrderUrl(orderId);

      // Make only one API request
      const result = await getRentalOrderDetailsAction(orderId);

      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to load rental order details!");

        updateOrderUrl();
        return;
      }

      setSelectedInvoice(result.data);
    } catch (error) {
      console.error("Failed to fetch rental order details:", error);

      toast.error("Something went wrong while loading order details.");

      updateOrderUrl();
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  // Close invoice and remove ID from URL
  const closeInvoice = () => {
    setSelectedInvoice(null);
    updateOrderUrl();
  };

  // Remove item from cart
  const removeFromCart = (gearItemId: string) => {
    const updated = cartItems.filter((item) => item.gearItemId !== gearItemId);

    syncCartStorage(updated);
  };

  // Update quantity with inventory validation
  const updateQuantity = (gearItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gearItemId);
      return;
    }

    const gear = getGearDetails(gearItemId);

    if (!gear || gear.status !== "AVAILABLE") {
      toast.error("This item is currently unavailable!");
      return;
    }

    const availableQuantity = Number(gear.quantity) || 0;

    if (quantity > availableQuantity) {
      toast.error("Not enough items available!");
      return;
    }

    const updated = cartItems.map((item) =>
      item.gearItemId === gearItemId ? { ...item, quantity } : item,
    );

    syncCartStorage(updated);
  };

  // Calculate billing days
  const getCartTotalDays = () => {
    if (!globalStartDate || !globalEndDate) return 1;

    const start = new Date(globalStartDate);
    const end = new Date(globalEndDate);

    if (end < start) return 1;

    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Math.max(1, diff + 1);
  };

  // Calculate cart total
  const calculateCartTotal = () => {
    const days = getCartTotalDays();

    return cartItems.reduce((sum, item) => {
      const gear = getGearDetails(item.gearItemId);
      const rate = Number(gear?.pricePerDay) || 0;

      return sum + rate * item.quantity * days;
    }, 0);
  };

  // Checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      return alert("Your cart is empty.");
    }

    if (!globalStartDate || !globalEndDate) {
      return alert(
        "Please select a global rental start and end date for your order.",
      );
    }

    // Validate inventory
    for (const item of cartItems) {
      const gear = getGearDetails(item.gearItemId);

      if (!gear || gear.status !== "AVAILABLE") {
        toast.error(`${gear?.name || "An item"} is currently unavailable!`);
        return;
      }

      if (Number(item.quantity) > Number(gear.quantity)) {
        toast.error(`Not enough items available for ${gear.name}!`);
        return;
      }
    }

    try {
      const payload = {
        startDate: globalStartDate,
        endDate: globalEndDate,
        items: cartItems.map((item) => ({
          gearItemId: item.gearItemId,
          quantity: Number(item.quantity),
        })),
      };

      const result = await createRentalOrderAction(payload);

      if (result.success) {
        alert(result.message);

        localStorage.removeItem("gearup_cart");

        setCartItems([]);
        setActiveTab("orders");

        window.location.reload();
      } else {
        alert(result.message || "Failed to place rental order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      alert("An unexpected error occurred during checkout.");
    }
  };

  // Cancel rental order
  const handleCancelOrder = async (
    e: React.MouseEvent<HTMLButtonElement>,
    orderId: string,
  ) => {
    e.stopPropagation();

    if (!confirm("Cancel this rental order?")) return;

    try {
      setCancellingOrderId(orderId);

      const result = await cancelRentalOrderAction(orderId);

      if (result.success) {
        alert(result.message || "Rental order cancelled successfully!");

        window.location.reload();
      } else {
        alert(result.message || "Failed to cancel this rental order.");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);

      alert("An unexpected error occurred while cancelling the order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 text-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              [ Customer Portal ]
            </span>

            <h1 className="text-3xl font-light tracking-tight text-zinc-900 mt-1">
              My Rental Portal
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border border-zinc-200 p-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-zinc-900 text-white font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Rental Orders ({rentalOrders.length})
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "cart"
                  ? "bg-zinc-900 text-white font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] rounded-full">
                  {cartItems.reduce((sum, i) => sum + Number(i.quantity), 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: RENTAL ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {rentalOrders.length === 0 && (
              <Card className="rounded-none border-zinc-200 bg-white p-12 text-center shadow-xs">
                <CardHeader className="space-y-2">
                  <Package className="h-10 w-10 text-zinc-400 mx-auto" />

                  <CardTitle className="text-lg font-mono uppercase tracking-tight">
                    No Active Rentals Found
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto mb-6">
                    You haven't reserved or rented any gear equipment yet.
                  </p>

                  <Button
                    asChild
                    className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-6"
                  >
                    <a href="/gear-items">Browse Gear Directory</a>
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentalOrders.map((order) => {
                const firstItem = order.items?.[0];

                const firstGear = firstItem
                  ? getGearDetails(firstItem.gearItemId)
                  : null;

                const firstImage =
                  firstGear?.images?.[0] ||
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80";

                const totalQty = order.items?.reduce(
                  (sum: number, item: any) => sum + Number(item.quantity),
                  0,
                );

                const uniqueItems = order.items?.length || 0;

                const startDate = new Date(order.startDate);
                const endDate = new Date(order.endDate);

                const rentalDays =
                  Math.max(
                    1,
                    Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                    ),
                  ) + 1;

                return (
                  <Card
                    key={order.id}
                    onClick={() => handleViewOrderDetails(order.id)}
                    className="group rounded-none border-zinc-200 bg-white p-5 hover:border-zinc-900 cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between border-b border-zinc-100 pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                            INV #{order.id.slice(0, 8).toUpperCase()}
                          </span>

                          <span className="text-xs font-mono font-semibold text-zinc-900">
                            {order.invoiceNo || `ORD-${order.id.slice(-4)}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={getStatusBadgeVariant(order.status) as any}
                            className="rounded-none text-[10px] font-mono uppercase px-2 py-0.5"
                          >
                            {order.status}
                          </Badge>

                          {["PLACED", "PENDING", "CONFIRMED"].includes(
                            order.status,
                          ) && (
                            <button
                              type="button"
                              disabled={
                                cancellingOrderId === order.id ||
                                loadingInvoiceId === order.id
                              }
                              onClick={(e) => handleCancelOrder(e, order.id)}
                              className="p-1 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel order"
                            >
                              {cancellingOrderId === order.id ? (
                                <span className="text-[10px] font-mono">
                                  ...
                                </span>
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 shrink-0 border border-zinc-200 overflow-hidden bg-zinc-50">
                          <img
                            src={firstImage}
                            alt={firstGear?.name || "Gear"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono uppercase text-zinc-400">
                            {firstGear?.brand || "Equipment"}
                          </p>

                          <h3 className="text-sm font-medium text-zinc-900 truncate">
                            {firstGear?.name ||
                              `Gear Asset (${uniqueItems} items)`}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 bg-[#FDFBF7] p-3 border border-zinc-200/80 font-mono text-[11px] text-zinc-600 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Package className="h-3 w-3" /> Quantity
                          </span>

                          <span className="font-medium text-zinc-900">
                            {totalQty} unit(s)
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Duration
                          </span>

                          <span>{rentalDays} Billing Day(s)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-zinc-100 pt-3">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400 uppercase">
                        <span>Fulfillment Status</span>

                        <span className="text-zinc-900 font-semibold">
                          {order.status}
                        </span>
                      </div>

                      <Progress
                        value={getStatusStep(order.status)}
                        className="h-1 rounded-none bg-zinc-100"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 mt-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                          Total Fee
                        </span>

                        <span className="text-base font-bold text-zinc-900 font-mono">
                          ৳{Number(order.totalAmount).toLocaleString()}
                        </span>
                      </div>

                      <span className="text-xs font-mono text-zinc-900 font-medium group-hover:underline flex items-center gap-0.5">
                        {loadingInvoiceId === order.id ? (
                          "Loading..."
                        ) : (
                          <>
                            Receipt <ArrowUpRight className="h-3 w-3" />
                          </>
                        )}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CART & CHECKOUT */}
        {activeTab === "cart" && (
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <Card className="rounded-none border-zinc-200 bg-white p-12 text-center shadow-xs">
                <CardHeader className="space-y-2">
                  <ShoppingCart className="h-10 w-10 text-zinc-400 mx-auto" />

                  <CardTitle className="text-lg font-mono uppercase tracking-tight">
                    Your Cart is Empty
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto mb-6">
                    Browse the directory and add items to your cart to create a
                    combined rental manifest.
                  </p>

                  <Button
                    asChild
                    className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-6"
                  >
                    <a href="/gear-items">Browse Gear Directory</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  <Card className="rounded-none border-zinc-200 bg-white p-6 shadow-xs">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 border-b border-zinc-100 pb-3">
                      Selected Cart Assets ({cartItems.length})
                    </h2>

                    <div className="space-y-4">
                      {cartItems.map((item) => {
                        const gear = getGearDetails(item.gearItemId);
                        const rate = Number(gear?.pricePerDay) || 0;
                        const availableQuantity = Number(gear?.quantity) || 0;

                        const isUnavailable =
                          !gear || gear.status !== "AVAILABLE";

                        return (
                          <div
                            key={item.gearItemId}
                            className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 shrink-0 border border-zinc-200 overflow-hidden bg-zinc-50">
                                <img
                                  src={
                                    gear?.images?.[0] ||
                                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
                                  }
                                  alt={gear?.name || "Gear"}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div>
                                <p className="text-[10px] font-mono uppercase text-zinc-400">
                                  {gear?.brand || "Equipment"}
                                </p>

                                <h4 className="text-sm font-medium text-zinc-900">
                                  {gear?.name || "Gear Asset"}
                                </h4>

                                <p className="text-xs font-mono text-zinc-600">
                                  ৳{rate.toLocaleString()} / day
                                </p>

                                <p className="text-[10px] font-mono text-zinc-400 mt-1">
                                  {isUnavailable
                                    ? "Currently unavailable"
                                    : `${availableQuantity} unit(s) in inventory`}
                                </p>

                                {Number(item.quantity) > availableQuantity && (
                                  <p className="text-[10px] text-red-600 font-mono mt-1">
                                    Not enough items available!
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-zinc-200 bg-white h-9">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.gearItemId,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="px-2.5 hover:bg-zinc-100 text-zinc-600 h-full flex items-center justify-center border-r border-zinc-200"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>

                                <span className="w-8 text-center text-xs font-mono font-medium text-zinc-900">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={
                                    isUnavailable ||
                                    Number(item.quantity) >= availableQuantity
                                  }
                                  onClick={() =>
                                    updateQuantity(
                                      item.gearItemId,
                                      item.quantity + 1,
                                    )
                                  }
                                  className="px-2.5 hover:bg-zinc-100 text-zinc-600 h-full flex items-center justify-center border-l border-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                                  title={
                                    isUnavailable ||
                                    Number(item.quantity) >= availableQuantity
                                      ? "Maximum available quantity reached"
                                      : "Increase quantity"
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.gearItemId)}
                                className="text-zinc-400 hover:text-red-600 p-1.5 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>

                {/* Date Selector & Checkout Summary */}
                <div className="lg:col-span-4 space-y-4">
                  <Card className="rounded-none border-zinc-200 bg-white p-6 shadow-xs space-y-4">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500 border-b border-zinc-100 pb-2">
                      Rental Window & Summary
                    </h2>

                    <div className="space-y-3 font-mono">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-400">
                          Start Date (All Items)
                        </label>

                        <Input
                          type="date"
                          value={globalStartDate}
                          onChange={(e) => setGlobalStartDate(e.target.value)}
                          className="h-9 text-xs rounded-none border-zinc-200 bg-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-400">
                          End Date (All Items)
                        </label>

                        <Input
                          type="date"
                          value={globalEndDate}
                          onChange={(e) => setGlobalEndDate(e.target.value)}
                          className="h-9 text-xs rounded-none border-zinc-200 bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 font-mono text-xs text-zinc-600 border-t border-zinc-100 pt-3">
                      <div className="flex justify-between">
                        <span>Total Items</span>

                        <span className="font-semibold text-zinc-900">
                          {cartItems.reduce(
                            (sum, i) => sum + Number(i.quantity),
                            0,
                          )}{" "}
                          units
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Billing Window</span>

                        <span className="font-semibold text-zinc-900">
                          {getCartTotalDays()} Day(s)
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-zinc-900 border-t border-zinc-200 pt-3">
                        <span>Combined Total</span>

                        <span>
                          ৳{calculateCartTotal().toLocaleString()} BDT
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase h-10 tracking-wider flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Checkout & Place Combined Order
                    </Button>

                    <p className="text-[10px] font-mono text-zinc-400 text-center">
                      * Applies shared schedule to all cart assets.
                    </p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAPER INVOICE DETAIL MODAL */}
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto border border-zinc-300 bg-[#FDFBF7] p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeInvoice}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center border-b border-zinc-300 pb-6 space-y-1 font-serif">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
                  GearUp Rental Corp — Official Receipt
                </span>

                <h2 className="text-2xl font-normal tracking-tight text-zinc-900">
                  Equipment Rental Statement
                </h2>

                <p className="text-xs font-mono text-zinc-500">
                  INV #{selectedInvoice.id.slice(0, 8).toUpperCase()} • Issued:{" "}
                  {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-zinc-200 pb-6">
                <div>
                  <span className="text-zinc-400 block uppercase text-[10px]">
                    Rental Window:
                  </span>

                  <span className="font-semibold text-zinc-900 block mt-0.5">
                    {new Date(selectedInvoice.startDate).toLocaleDateString()} —{" "}
                    {new Date(selectedInvoice.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 block uppercase text-[10px]">
                    Order Status:
                  </span>

                  <Badge
                    variant={
                      getStatusBadgeVariant(selectedInvoice.status) as any
                    }
                    className="rounded-none text-xs font-mono uppercase px-2 py-0.5 mt-1"
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 block">
                  Itemized Manifest
                </span>

                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-300 text-left text-zinc-500">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium text-center">Qty</th>
                      <th className="pb-2 font-medium text-right">Rate/Day</th>
                      <th className="pb-2 font-medium text-right">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-200">
                    {selectedInvoice.items?.map((item: any) => {
                      const gear =
                        item.gearItem || getGearDetails(item.gearItemId);

                      const quantity = Number(item.quantity) || 0;
                      const rate = Number(item.pricePerDay) || 0;
                      const itemAmount = rate * quantity;

                      const specifications = gear?.specifications
                        ? Object.entries(gear.specifications).slice(0, 3)
                        : [];

                      return (
                        <tr key={item.id || item.gearItemId}>
                          <td className="py-3 pr-2 text-zinc-900 font-sans">
                            <div className="flex items-start gap-2">
                              {gear?.images?.[0] && (
                                <img
                                  src={gear.images[0]}
                                  alt={gear.name || "Gear"}
                                  className="w-12 h-12 object-cover border border-zinc-200 shrink-0"
                                />
                              )}

                              <div className="min-w-0">
                                <p className="font-medium">
                                  {gear?.name || "Equipment Item"}
                                </p>

                                {gear?.brand && (
                                  <p className="text-[10px] text-zinc-500 mt-0.5">
                                    {gear.brand}
                                  </p>
                                )}

                                {gear?.condition && (
                                  <p className="text-[10px] text-zinc-500 mt-0.5">
                                    Condition: {gear.condition}
                                  </p>
                                )}

                                {specifications.length > 0 && (
                                  <div className="mt-1 space-y-0.5">
                                    {specifications.map(([key, value]) => (
                                      <p
                                        key={key}
                                        className="text-[9px] text-zinc-400"
                                      >
                                        {key}: {String(value)}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 text-center text-zinc-600">
                            {quantity}
                          </td>

                          <td className="py-3 text-right text-zinc-600 whitespace-nowrap">
                            ৳{rate.toLocaleString()}
                          </td>

                          <td className="py-3 text-right font-semibold text-zinc-900 whitespace-nowrap">
                            ৳{itemAmount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-zinc-300 pt-4 flex justify-between items-center">
                <div className="text-zinc-500 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-700" />
                  <span>Verified Deposit Protection</span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] block uppercase">
                    Total Statement
                  </span>

                  <span className="text-lg font-bold text-zinc-900">
                    ৳{Number(selectedInvoice.totalAmount).toLocaleString()} BDT
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 flex justify-end">
                <Button
                  onClick={closeInvoice}
                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono uppercase px-6 h-9"
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
