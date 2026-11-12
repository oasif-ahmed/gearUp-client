"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
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
  CheckCircle2,
  Loader2,
  Clock,
  Copy,
  Check,
  Star,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

type CustomerCartProps = {
  rentalOrders: any[];
  gearItems: any[];
  paymentHistory: any;
  myReviews?: any[];

  createRentalOrderAction: (payload: any) => Promise<any>;
  cancelRentalOrderAction: (orderId: string) => Promise<any>;
  getRentalOrderDetailsAction: (orderId: string) => Promise<any>;
  createPaymentAction: (orderId: string) => Promise<any>;
};

export default function CustomerCart({
  rentalOrders = [],
  gearItems = [],
  paymentHistory,
  myReviews = [],
  createRentalOrderAction,
  cancelRentalOrderAction,
  getRentalOrderDetailsAction,
  createPaymentAction,
}: CustomerCartProps) {
  const router = useRouter();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "cart" | "reviews">("orders");

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [globalStartDate, setGlobalStartDate] = useState("");
  const [globalEndDate, setGlobalEndDate] = useState("");

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null,
  );

  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);

  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null,
  );

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // ============================================
  // URL SYNC & INITIALIZATION ON MOUNT
  // ============================================

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("gearup_cart") || "[]");
      setCartItems(savedCart);
    } catch (error) {
      console.error("Failed to parse cart storage:", error);
    }

    // Check URL parameters on load to auto-open invoice or review modal
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get("id");
    const reviewIdParam = params.get("reviewId");

    if (orderIdParam) {
      const foundOrder = rentalOrders.find((o) => o.id === orderIdParam);
      if (foundOrder) {
        setSelectedInvoice(foundOrder);
      }
    } else if (reviewIdParam && myReviews.length > 0) {
      const foundReview = myReviews.find((r) => r.id === reviewIdParam);
      if (foundReview) {
        setSelectedReview(foundReview);
        setActiveTab("reviews");
      }
    }
  }, [rentalOrders, myReviews]);

  const syncCartStorage = (updatedCart: any[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("gearup_cart", JSON.stringify(updatedCart));
  };

  // ============================================
  // GEAR DETAILS
  // ============================================

  const getGearDetails = (gearItemId: string) => {
    return gearItems.find((gear: any) => gear.id === gearItemId);
  };

  // ============================================
  // PAYMENT HISTORY
  // ============================================

  const getPaymentRecords = () => {
    return paymentHistory?.data?.payments || [];
  };

  const getPaymentForOrder = (order: any) => {
    return getPaymentRecords().find(
      (payment: any) => payment.rentalOrder?.id === order.id,
    );
  };

  const getPaymentStatus = (order: any): PaymentStatus => {
    const payment = getPaymentForOrder(order);

    if (payment?.status) {
      return payment.status;
    }

    const embeddedStatus = order?.payment?.status || order?.paymentStatus;

    if (embeddedStatus) {
      return embeddedStatus;
    }

    if (order?.status === "PAID") {
      return "COMPLETED";
    }

    return "PENDING";
  };

  const canPay = (order: any) => {
    const status = getPaymentStatus(order);

    return (
      ["PENDING", "FAILED"].includes(status) &&
      !["CANCELLED", "RETURNED", "PAID"].includes(order?.status)
    );
  };

  const formatPaymentDate = (date: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: any) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
  };

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Could not copy to clipboard.");
    }
  };

  // ============================================
  // PAYMENT HANDLER
  // ============================================

  const handlePayment = async (orderId: string) => {
    if (processingPaymentId) return;

    try {
      setProcessingPaymentId(orderId);

      const result = await createPaymentAction(orderId);

      if (!result.success) {
        toast.error(result.message || "Failed to initiate payment.");
        return;
      }

      const checkoutUrl = result.data?.result?.checkoutUrl;

      if (!checkoutUrl) {
        toast.error("Payment checkout URL was not returned.");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Something went wrong while initiating payment.");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  // ============================================
  // RENTAL ORDER STATUS
  // ============================================

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
      case "PAID":
        return 50;
      default:
        return 10;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PLACED":
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-50";
      case "CONFIRMED":
        return "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-50";
      case "PAID":
        return "bg-violet-50 text-violet-800 border-violet-300 hover:bg-violet-50";
      case "PICKED_UP":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-50";
      case "RETURNED":
        return "bg-muted text-foreground border-border hover:bg-muted";
      case "CANCELLED":
        return "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-50";
      default:
        return "bg-muted text-muted-foreground border-border hover:bg-muted";
    }
  };

  const getPaymentButtonContent = (order: any) => {
    const status = getPaymentStatus(order);

    if (processingPaymentId === order.id) {
      return (
        <>
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
          Processing
        </>
      );
    }

    if (status === "COMPLETED") {
      return (
        <>
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </>
      );
    }

    if (status === "FAILED") {
      return "Retry";
    }

    return (
      <>
        <CreditCard className="h-3 w-3 mr-1" />
        Pay Now
      </>
    );
  };

  const getPaymentButtonClass = (order: any) => {
    const status = getPaymentStatus(order);

    if (status === "COMPLETED") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 cursor-not-allowed";
    }

    if (status === "FAILED") {
      return "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100";
    }

    return "bg-primary text-white hover:bg-primary/90";
  };

  // ============================================
  // URL MANAGEMENT
  // ============================================

  const updateOrderUrl = (orderId?: string) => {
    const params = new URLSearchParams(window.location.search);

    if (orderId) {
      params.set("id", orderId);
      params.delete("reviewId");
    } else {
      params.delete("id");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/customer-cart?${queryString}` : "/customer-cart";
    window.history.pushState(null, "", newUrl);
  };

  const updateReviewUrl = (reviewId?: string) => {
    const params = new URLSearchParams(window.location.search);

    if (reviewId) {
      params.set("reviewId", reviewId);
      params.delete("id");
    } else {
      params.delete("reviewId");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/customer-cart?${queryString}` : "/customer-cart";
    window.history.pushState(null, "", newUrl);
  };

  // ============================================
  // INVOICE DETAILS & REVIEW MODALS
  // ============================================

  const handleViewOrderDetails = async (orderId: string) => {
    if (loadingInvoiceId) return;

    const existingOrder = rentalOrders.find((order) => order.id === orderId);

    if (!existingOrder) {
      toast.error("Rental order not found.");
      return;
    }

    setSelectedInvoice(existingOrder);
    setLoadingInvoiceId(orderId);
    updateOrderUrl(orderId);

    try {
      const result = await getRentalOrderDetailsAction(orderId);

      if (!result.success || !result.data) {
        toast.error(result.message || "Failed to load complete invoice details.");
        return;
      }

      setSelectedInvoice(result.data);
    } catch (error) {
      console.error("Failed to fetch rental order details:", error);
      toast.error("Something went wrong while loading order details.");
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const closeInvoice = () => {
    setSelectedInvoice(null);
    updateOrderUrl();
  };

  const handleViewReviewDetails = (review: any) => {
    setSelectedReview(review);
    updateReviewUrl(review.id);
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
    updateReviewUrl();
  };

  // ============================================
  // CART OPERATIONS
  // ============================================

  const removeFromCart = (gearItemId: string) => {
    const updated = cartItems.filter((item) => item.gearItemId !== gearItemId);
    syncCartStorage(updated);
  };

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

  const calculateCartTotal = () => {
    const days = getCartTotalDays();

    return cartItems.reduce((sum, item) => {
      const gear = getGearDetails(item.gearItemId);
      const rate = Number(gear?.pricePerDay) || 0;

      return sum + rate * item.quantity * days;
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!globalStartDate || !globalEndDate) {
      toast.error("Please select a global rental start and end date.");
      return;
    }

    if (new Date(globalEndDate) < new Date(globalStartDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

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
        toast.success(result.message || "Rental order placed successfully!");
        localStorage.removeItem("gearup_cart");
        setCartItems([]);
        setActiveTab("orders");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to place rental order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred during checkout.");
    }
  };

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
        toast.success(result.message || "Rental order cancelled successfully!");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel this rental order.");
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("An unexpected error occurred while cancelling.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-background py-10 text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER */}

        <div className="border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              [ Customer Portal ]
            </span>

            <h1 className="text-3xl font-light tracking-tight text-foreground mt-1">
              My Rental Portal
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-card border border-border p-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Rental Orders ({rentalOrders.length})
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "cart"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full">
                  {cartItems.reduce(
                    (sum, item) => sum + Number(item.quantity),
                    0,
                  )}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              My Reviews ({myReviews.length})
            </button>
          </div>
        </div>

        {/* ====================================== */}
        {/* RENTAL ORDERS */}
        {/* ====================================== */}

        {activeTab === "orders" && (
          <div className="space-y-6">
            {rentalOrders.length === 0 && (
              <Card className="rounded-none border-border bg-card p-12 text-center shadow-xs">
                <CardHeader className="space-y-2">
                  <Package className="h-10 w-10 text-muted-foreground mx-auto" />

                  <CardTitle className="text-lg font-mono uppercase tracking-tight">
                    No Active Rentals Found
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto mb-6">
                    You haven't reserved or rented any gear equipment yet.
                  </p>

                  <Button
                    asChild
                    className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-mono uppercase px-6"
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

                const totalQty =
                  order.items?.reduce(
                    (sum: number, item: any) => sum + Number(item.quantity),
                    0,
                  ) ?? 0;

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
                    className="group rounded-none border-border bg-card p-5 hover:border-primary cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div>
                      {/* ORDER HEADER */}

                      <div className="flex items-start justify-between border-b border-border pb-3 mb-4">
                        <div>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                            INV #{order.id.slice(0, 8).toUpperCase()}
                          </span>

                          <span className="text-xs font-mono font-semibold text-foreground">
                            {order.invoiceNo || `ORD-${order.id.slice(-4)}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Badge
                            className={`rounded-none text-[10px] font-mono uppercase px-2 py-0.5 ${getStatusBadgeClass(order.status)}`}
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
                              className="p-1 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel order"
                            >
                              {cancellingOrderId === order.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* GEAR INFORMATION */}

                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 shrink-0 border border-border overflow-hidden bg-muted">
                          <img
                            src={firstImage}
                            alt={firstGear?.name || "Gear"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono uppercase text-muted-foreground">
                            {firstGear?.brand || "Equipment"}
                          </p>

                          <h3 className="text-sm font-medium text-foreground truncate">
                            {firstGear?.name ||
                              `Gear Asset (${uniqueItems} items)`}
                          </h3>
                        </div>
                      </div>

                      {/* ORDER SUMMARY */}

                      <div className="space-y-2 bg-background p-3 border border-border/80 font-mono text-[11px] text-muted-foreground mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Quantity
                          </span>

                          <span className="font-medium text-foreground">
                            {totalQty} unit(s)
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Duration
                          </span>

                          <span>{rentalDays} Billing Day(s)</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rental Start</span>

                          <span className="text-foreground">
                            {startDate.toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Rental End</span>

                          <span className="text-foreground">
                            {endDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* FULFILLMENT PROGRESS */}

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                        <span>Fulfillment Status</span>

                        <span className="text-foreground font-semibold">
                          {order.status}
                        </span>
                      </div>

                      <Progress
                        value={getStatusStep(order.status)}
                        className="h-1 rounded-none bg-muted"
                      />
                    </div>

                    {/* TOTAL + PAYMENT BUTTON */}

                    <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                          Total Fee
                        </span>

                        <span className="text-base font-bold text-foreground font-mono">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={
                          processingPaymentId === order.id || !canPay(order)
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          if (canPay(order)) {
                            handlePayment(order.id);
                          }
                        }}
                        className={`h-8 px-3 rounded-none text-[10px] font-mono uppercase ${getPaymentButtonClass(order)}`}
                      >
                        {getPaymentButtonContent(order)}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* CART & CHECKOUT */}
        {/* ====================================== */}

        {activeTab === "cart" && (
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <Card className="rounded-none border-border bg-card p-12 text-center shadow-xs">
                <CardHeader className="space-y-2">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto" />

                  <CardTitle className="text-lg font-mono uppercase tracking-tight">
                    Your Cart is Empty
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto mb-6">
                    Browse the directory and add items to your cart to create a
                    combined rental manifest.
                  </p>

                  <Button
                    asChild
                    className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-mono uppercase px-6"
                  >
                    <a href="/gear-items">Browse Gear Directory</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <Card className="rounded-none border-border bg-card p-6 shadow-xs">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-3">
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
                            className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 shrink-0 border border-border overflow-hidden bg-muted">
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
                                <p className="text-[10px] font-mono uppercase text-muted-foreground">
                                  {gear?.brand || "Equipment"}
                                </p>

                                <h4 className="text-sm font-medium text-foreground">
                                  {gear?.name || "Gear Asset"}
                                </h4>

                                <p className="text-xs font-mono text-muted-foreground">
                                  {formatCurrency(rate)} / day
                                </p>

                                <p className="text-[10px] font-mono text-muted-foreground mt-1">
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

                            <div className="flex items-center gap-4">
                              <div className="flex items-center border border-border bg-card h-9">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.gearItemId,
                                      item.quantity - 1,
                                    )
                                  }
                                  className="px-2.5 hover:bg-muted text-muted-foreground h-full flex items-center justify-center border-r border-border"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>

                                <span className="w-8 text-center text-xs font-mono font-medium text-foreground">
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
                                  className="px-2.5 hover:bg-muted text-muted-foreground h-full flex items-center justify-center border-l border-border disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFromCart(item.gearItemId)}
                                className="text-muted-foreground hover:text-red-600 p-1.5 transition-colors"
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

                <div className="lg:col-span-4 space-y-4">
                  <Card className="rounded-none border-border bg-card p-6 shadow-xs space-y-4">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                      Rental Window & Summary
                    </h2>

                    <div className="space-y-3 font-mono">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-muted-foreground">
                          Start Date (All Items)
                        </label>

                        <Input
                          type="date"
                          value={globalStartDate}
                          onChange={(e) => setGlobalStartDate(e.target.value)}
                          className="h-9 text-xs rounded-none border-border bg-card font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-muted-foreground">
                          End Date (All Items)
                        </label>

                        <Input
                          type="date"
                          value={globalEndDate}
                          onChange={(e) => setGlobalEndDate(e.target.value)}
                          className="h-9 text-xs rounded-none border-border bg-card font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 font-mono text-xs text-muted-foreground border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span>Total Items</span>

                        <span className="font-semibold text-foreground">
                          {cartItems.reduce(
                            (sum, item) => sum + Number(item.quantity),
                            0,
                          )}{" "}
                          units
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Billing Window</span>

                        <span className="font-semibold text-foreground">
                          {getCartTotalDays()} Day(s)
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-3">
                        <span>Combined Total</span>

                        <span>{formatCurrency(calculateCartTotal())} BDT</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-mono uppercase h-10 tracking-wider flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Checkout & Place Combined Order
                    </Button>

                    <p className="text-[10px] font-mono text-muted-foreground text-center">
                      * Applies shared schedule to all cart assets.
                    </p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================== */}
        {/* REVIEWS TAB VIEW */}
        {/* ====================================== */}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {myReviews.length === 0 ? (
              <Card className="rounded-none border-border bg-card p-12 text-center shadow-xs">
                <CardHeader className="space-y-2">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />

                  <CardTitle className="text-lg font-mono uppercase tracking-tight">
                    No Reviews Found
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-xs font-mono text-muted-foreground max-w-sm mx-auto mb-6">
                    You haven't submitted any reviews for your rented items yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myReviews.map((review) => {
                  const reviewGear = review.gearItem || getGearDetails(review.gearItemId);
                  const gearId = review.gearItemId || reviewGear?.id;

                  return (
                    <Card
                      key={review.id}
                      onClick={() => handleViewReviewDetails(review)}
                      className="group rounded-none border-border bg-card p-5 hover:border-primary cursor-pointer transition-all flex flex-col justify-between shadow-xs hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between border-b border-border pb-3 mb-4">
                          <div>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">
                              REV #{review.id.slice(0, 8).toUpperCase()}
                            </span>

                            <div className="flex items-center gap-1 mt-1 text-amber-500">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < (review.rating || 0)
                                      ? "fill-current text-amber-500"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <Badge className="rounded-none text-[10px] font-mono uppercase px-2 py-0.5 bg-muted text-foreground border-border">
                            {review.rating} Stars
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-[10px] font-mono uppercase text-muted-foreground">
                            {reviewGear?.brand || "Equipment"}
                          </p>

                          <h3 className="text-sm font-medium text-foreground truncate">
                            {reviewGear?.name || "Gear Item"}
                          </h3>
                        </div>

                        <p className="text-xs font-mono text-muted-foreground line-clamp-3 bg-background p-3 border border-border/80">
                          "{review.comment || review.content || "No comment provided."}"
                        </p>
                      </div>

                      <div className="border-t border-border pt-3 mt-4 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-muted-foreground">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>

                        {gearId && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-7 px-2.5 rounded-none text-[10px] font-mono uppercase border-border hover:bg-primary hover:text-white"
                          >
                            <a href={`/gear-items/${gearId}`}>
                              View Product <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====================================== */}
        {/* INVOICE MODAL */}
        {/* ====================================== */}

        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border border-border bg-background p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeInvoice}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center border-b border-border pb-6 space-y-1 font-serif">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  GearUp Rental Corp — Official Receipt
                </span>

                <h2 className="text-2xl font-normal tracking-tight text-foreground">
                  Equipment Rental Statement
                </h2>

                <p className="text-xs font-mono text-muted-foreground">
                  INV #{selectedInvoice.id.slice(0, 8).toUpperCase()} • Issued:{" "}
                  {selectedInvoice.createdAt
                    ? new Date(selectedInvoice.createdAt).toLocaleDateString()
                    : "Loading..."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-border pb-6">
                <div>
                  <span className="text-muted-foreground block uppercase text-[10px]">
                    Rental Window:
                  </span>

                  <span className="font-semibold text-foreground block mt-0.5">
                    {new Date(selectedInvoice.startDate).toLocaleDateString()}{" "}
                    — {new Date(selectedInvoice.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground block uppercase text-[10px]">
                    Order Status:
                  </span>

                  <Badge
                    className={`rounded-none text-xs font-mono uppercase px-2 py-0.5 mt-1 ${getStatusBadgeClass(selectedInvoice.status)}`}
                  >
                    {selectedInvoice.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">
                  Itemized Manifest
                </span>

                {loadingInvoiceId === selectedInvoice.id ? (
                  <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />

                    <span className="text-xs font-mono uppercase">
                      Loading invoice details...
                    </span>
                  </div>
                ) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium text-center">Qty</th>
                        <th className="pb-2 font-medium text-right">
                          Rate/Day
                        </th>
                        <th className="pb-2 font-medium text-right">Amount</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                      {selectedInvoice.items?.map((item: any) => {
                        const gear =
                          item.gearItem || getGearDetails(item.gearItemId);

                        const quantity = Number(item.quantity) || 0;
                        const rate = Number(item.pricePerDay) || 0;
                        const itemAmount = rate * quantity;

                        return (
                          <tr key={item.id || item.gearItemId}>
                            <td className="py-3 pr-2 text-foreground font-sans">
                              <div className="flex items-start gap-2">
                                {gear?.images?.[0] && (
                                  <img
                                    src={gear.images[0]}
                                    alt={gear.name || "Gear"}
                                    className="w-12 h-12 object-cover border border-border shrink-0"
                                  />
                                )}

                                <div className="min-w-0">
                                  <p className="font-medium">
                                    {gear?.name || "Equipment Item"}
                                  </p>

                                  {gear?.brand && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      {gear.brand}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3 text-center text-muted-foreground">
                              {quantity}
                            </td>

                            <td className="py-3 text-right text-muted-foreground whitespace-nowrap">
                              {formatCurrency(rate)}
                            </td>

                            <td className="py-3 text-right font-semibold text-foreground whitespace-nowrap">
                              {formatCurrency(itemAmount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                  <span>Verified Deposit Protection</span>
                </div>

                <div className="text-right">
                  <span className="text-muted-foreground text-[10px] block uppercase">
                    Total Statement
                  </span>

                  <span className="text-lg font-bold text-foreground">
                    {formatCurrency(selectedInvoice.totalAmount)} BDT
                  </span>
                </div>
              </div>

              {(() => {
                const invoicePayment = getPaymentForOrder(selectedInvoice);

                if (!invoicePayment) {
                  return (
                    <div className="border border-border bg-muted p-4 text-[10px] text-muted-foreground">
                      No payment transaction has been recorded for this rental
                      order yet.
                    </div>
                  );
                }

                const isCompleted = invoicePayment.status === "COMPLETED";

                return (
                  <div
                    className={`border p-4 space-y-3 ${
                      isCompleted
                        ? "border-emerald-200 bg-emerald-50/70"
                        : invoicePayment.status === "FAILED"
                          ? "border-red-200 bg-red-50/70"
                          : "border-border bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        )}

                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Payment History
                        </span>
                      </div>

                      <Badge
                        className={`rounded-none ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                            : invoicePayment.status === "FAILED"
                              ? "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-50"
                              : "bg-muted text-foreground border-border hover:bg-muted"
                        }`}
                      >
                        {invoicePayment.status}
                      </Badge>
                    </div>

                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Amount Paid</span>

                      <span className="font-bold text-foreground">
                        {formatCurrency(invoicePayment.amount)}
                      </span>
                    </div>

                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Paid At
                        </span>

                        <span className="text-right text-foreground">
                          {formatPaymentDate(invoicePayment.paidAt)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-muted-foreground shrink-0">
                          Transaction ID
                        </span>

                        <span className="flex items-start justify-end gap-1.5 max-w-[65%]">
                          <span className="text-right text-foreground break-all">
                            {invoicePayment.transactionId || "Not available"}
                          </span>

                          {invoicePayment.transactionId && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  invoicePayment.transactionId,
                                  "transactionId",
                                )
                              }
                              className="shrink-0 mt-px text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy transaction ID"
                            >
                              {copiedField === "transactionId" ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <Button
                  type="button"
                  size="sm"
                  disabled={
                    loadingInvoiceId === selectedInvoice.id ||
                    processingPaymentId === selectedInvoice.id ||
                    !canPay(selectedInvoice)
                  }
                  onClick={() => {
                    if (canPay(selectedInvoice)) {
                      handlePayment(selectedInvoice.id);
                    }
                  }}
                  className={`h-9 px-4 rounded-none text-xs font-mono uppercase ${getPaymentButtonClass(selectedInvoice)}`}
                >
                  {getPaymentButtonContent(selectedInvoice)}
                </Button>

                <Button
                  onClick={closeInvoice}
                  className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-mono uppercase px-6 h-9"
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================== */}
        {/* REVIEW DETAILS MODAL */}
        {/* ====================================== */}

        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border border-border bg-background p-8 rounded-none shadow-2xl space-y-6 relative font-mono text-xs">
              <button
                type="button"
                onClick={closeReviewModal}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center border-b border-border pb-6 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                  GearUp Customer Review Statement
                </span>

                <h2 className="text-2xl font-normal tracking-tight text-foreground font-serif">
                  Review Details
                </h2>

                <p className="text-xs font-mono text-muted-foreground">
                  REV #{selectedReview.id.toUpperCase()} • Submitted:{" "}
                  {selectedReview.createdAt
                    ? new Date(selectedReview.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {(() => {
                const reviewGear = selectedReview.gearItem || getGearDetails(selectedReview.gearItemId);
                const gearId = selectedReview.gearItemId || reviewGear?.id;

                return (
                  <div className="space-y-4">
                    <div className="bg-card p-4 border border-border space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-mono uppercase text-muted-foreground">
                            {reviewGear?.brand || "Equipment Asset"}
                          </p>

                          <h4 className="text-sm font-medium text-foreground">
                            {reviewGear?.name || "Gear Item"}
                          </h4>
                        </div>

                        {gearId && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 rounded-none text-[10px] font-mono uppercase border-border hover:bg-primary hover:text-white"
                          >
                            <a href={`/gear-items/${gearId}`}>
                              View Product <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 pt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < (selectedReview.rating || 0)
                                ? "fill-current text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-mono font-semibold text-foreground ml-1">
                          ({selectedReview.rating}/5)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest block">
                        Review Comment
                      </span>

                      <div className="bg-card border border-border p-4 text-xs font-mono text-foreground leading-relaxed min-h-[100px]">
                        {selectedReview.comment || selectedReview.content || "No detailed comment provided."}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-border flex justify-end">
                <Button
                  onClick={closeReviewModal}
                  className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-mono uppercase px-6 h-9"
                >
                  Close Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}