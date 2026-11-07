"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Layers,
  PackageCheck,
  RotateCcw,
  ShoppingCart,
  Star,
  MessageSquare,
  Send,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function GearDetailsClient({
  gearItem,
  initialReviews = [],
  createReviewAction,
  updateReviewAction,
  deleteReviewAction,
}: {
  gearItem: any;
  initialReviews: any[];
  createReviewAction: (payload: any) => Promise<any>;
  updateReviewAction?: (reviewId: string, payload: any) => Promise<any>;
  deleteReviewAction?: (reviewId: string) => Promise<any>;
}) {
  const [selectedImage, setSelectedImage] = useState<string>(
    gearItem?.images?.[0] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
  );
  const [cartQuantity, setCartQuantity] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Edit review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [isUpdatingReview, setIsUpdatingReview] = useState<boolean>(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  useEffect(() => {
    if (gearItem?.images && gearItem.images.length > 0) {
      setSelectedImage(gearItem.images[0]);
    }
  }, [gearItem]);

  // Read current item's quantity from localStorage cart
  useEffect(() => {
    if (!gearItem?.id) return;
    try {
      const existingCart = JSON.parse(localStorage.getItem("gearup_cart") || "[]");
      const existingItem = Array.isArray(existingCart)
        ? existingCart.find((item: any) => item.gearItemId === gearItem.id)
        : null;
      setCartQuantity(Number(existingItem?.quantity) || 0);
    } catch {
      setCartQuantity(0);
    }
  }, [gearItem?.id]);

  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("gearup_cart") || "[]");
      if (!Array.isArray(existingCart)) {
        toast.error("Invalid cart data. Please refresh.");
        return;
      }

      const existingItem = existingCart.find((item: any) => item.gearItemId === gearItem.id);
      const currentQuantity = Number(existingItem?.quantity) || 0;
      const availableQuantity = Number(gearItem.quantity) || 0;

      if (gearItem.status !== "AVAILABLE" || currentQuantity >= availableQuantity) {
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
      setCartQuantity(currentQuantity + 1);
      toast.success(`${gearItem.name} added to your rental cart!`);
    } catch {
      toast.error("Failed to update cart storage.");
    }
  };

  // Create Review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const payload = {
        gearItemId: gearItem.id,
        rating: Number(rating),
        comment,
      };

      const result = await createReviewAction(payload);
      if (result.success) {
        toast.success("Review posted successfully!");
        setReviews([result.data, ...reviews]);
        setComment("");
        setRating(5);
      } else {
        toast.error(result.message || "Failed to post review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while posting review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Start Editing Review
  const handleStartEdit = (review: any) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating || 5);
    setEditComment(review.comment || "");
  };

  // Cancel Editing Review
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  // Update Review
  const handleUpdateReview = async (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    if (!updateReviewAction) {
      toast.error("Update action is not provided.");
      return;
    }

    setIsUpdatingReview(true);
    try {
      const payload = {
        rating: Number(editRating),
        comment: editComment,
      };

      const result = await updateReviewAction(reviewId, payload);
      if (result.success) {
        toast.success("Review updated successfully!");
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, rating: Number(editRating), comment: editComment, updatedAt: new Date().toISOString() }
              : r
          )
        );
        handleCancelEdit();
      } else {
        toast.error(result.message || "Failed to update review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating the review.");
    } finally {
      setIsUpdatingReview(false);
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    if (!deleteReviewAction) {
      toast.error("Delete action is not provided.");
      return;
    }

    setDeletingReviewId(reviewId);
    try {
      const result = await deleteReviewAction(reviewId);
      if (result.success) {
        toast.success("Review deleted successfully!");
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        toast.error(result.message || "Failed to delete review.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deleting the review.");
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (!gearItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 font-mono text-xs">
        <Card className="w-full max-w-md text-center rounded-none border-zinc-200 shadow-xs">
          <CardHeader className="space-y-2">
            <AlertCircle className="h-10 w-10 text-red-600 mx-auto" />
            <CardTitle className="text-lg uppercase tracking-tight">Item Not Found</CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              The requested rental gear item could not be located.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild size="sm" className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase">
              <Link href="/gear-items">Return to Gear Directory</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const images = gearItem.images?.length > 0 ? gearItem.images : [selectedImage];
  const specEntries = Object.entries(gearItem.specifications || {});
  const availableQuantity = Number(gearItem.quantity) || 0;
  const remainingQuantity = Math.max(0, availableQuantity - cartQuantity);
  const isOutOfStock = gearItem.status !== "AVAILABLE" || remainingQuantity <= 0;

  return (
    <div className="py-10 text-zinc-900 font-mono text-xs">
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <Link
            href="/gear-items"
            className="inline-flex items-center gap-1.5 uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Directory
          </Link>
          <span className="text-[11px] uppercase text-zinc-400">
            REF: #{gearItem.id?.slice(-8) || "ITEM-001"}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Media Showcase */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white border border-zinc-200 p-6 shadow-xs">
            <div className="relative w-full flex-1 min-h-[380px] overflow-hidden bg-zinc-50 mb-4 border border-zinc-100">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={gearItem.name || "Equipment Image"}
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  Loading Image...
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge className="rounded-none bg-zinc-900 text-white hover:bg-zinc-900 text-[10px] uppercase px-2 py-0.5">
                  {gearItem.category?.name || "Equipment"}
                </Badge>
                <Badge
                  variant="outline"
                  className={`rounded-none text-[10px] uppercase px-2 py-0.5 border ${
                    gearItem.status === "AVAILABLE"
                      ? "border-green-600 text-green-700 bg-green-50"
                      : "border-red-600 text-red-700 bg-red-50"
                  }`}
                >
                  {gearItem.status}
                </Badge>
              </div>
            </div>

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
                        isSelected ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`view-${i}`} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoice Summary & Cart Action */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-zinc-200 p-8 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="uppercase tracking-wider text-zinc-500">{gearItem.brand}</span>
                <span className="text-zinc-300">•</span>
                <span className="uppercase text-zinc-500">Condition: {gearItem.condition || "Standard"}</span>
              </div>
              <h1 className="text-2xl font-normal tracking-tight text-zinc-900 mb-3 font-serif">
                {gearItem.name}
              </h1>
              <p className="text-xs text-zinc-600 leading-relaxed border-b border-zinc-100 pb-6 line-clamp-3">
                {gearItem.description}
              </p>
            </div>

            <div className="space-y-3 bg-[#FDFBF7] p-4 border border-zinc-200/80 my-4">
              <div className="flex justify-between items-center text-zinc-600">
                <span>Daily Rental Fee</span>
                <span className="text-sm font-bold text-zinc-900">৳{gearItem.pricePerDay}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                <span>Security Deposit (Refundable)</span>
                <span>৳{gearItem.securityDeposit}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 text-[11px] border-t border-zinc-200/60 pt-2">
                <span>Inventory Status</span>
                <span className="text-zinc-900 font-semibold">{remainingQuantity} units available</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase tracking-wider h-11 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? "Out of Stock" : `Add to Cart — ৳${gearItem.pricePerDay}/Day`}
              </Button>
              <p className="text-[10px] text-zinc-400 text-center">
                Zero hidden fees. Deposit released upon return verification.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specs & Safeguards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-7 bg-white border border-zinc-200 p-8 shadow-xs">
            <h2 className="uppercase tracking-widest text-zinc-900 font-semibold mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Layers className="h-4 w-4 text-zinc-700" /> Technical Specifications
            </h2>
            {specEntries.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {specEntries.map(([key, value]) => (
                  <div key={key} className="py-2.5 flex justify-between items-center gap-4">
                    <span className="text-zinc-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-zinc-900 font-medium text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 italic">No extra technical parameters specified for this unit.</p>
            )}
          </div>

          <div className="md:col-span-5 bg-white border border-zinc-200 p-8 shadow-xs">
            <h2 className="uppercase tracking-widest text-zinc-900 font-semibold mb-6 flex items-center gap-2 border-b border-zinc-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-zinc-700" /> Terms & Safeguards
            </h2>
            <div className="space-y-4 text-xs text-zinc-600">
              <div className="flex items-start gap-3">
                <PackageCheck className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">Verified Equipment</p>
                  <p className="text-zinc-500 text-[11px]">Inspected for standard operation in {gearItem.condition || "Standard"} state.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-4 w-4 text-zinc-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 mb-0.5">Instant Deposit Settlement</p>
                  <p className="text-zinc-500 text-[11px]">Your ৳{gearItem.securityDeposit} deposit is securely held and refunded upon return.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white border border-zinc-200 p-8 shadow-xs space-y-8">
          <div className="border-b border-zinc-200 pb-4 flex justify-between items-center">
            <h2 className="uppercase tracking-widest text-zinc-900 font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-zinc-700" /> Customer Reviews & Ratings ({reviews.length})
            </h2>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="bg-[#FDFBF7] p-6 border border-zinc-200 space-y-4">
            <h3 className="uppercase tracking-wider text-zinc-700 font-semibold">Write an Equipment Review</h3>
            
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 uppercase">Rating:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border border-zinc-200 bg-white px-3 py-1.5 uppercase text-xs"
              >
                <option value={5}>5 Stars (Exceptional)</option>
                <option value={4}>4 Stars (Very Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Subpar)</option>
                <option value={1}>1 Star (Poor)</option>
              </select>
            </div>

            <div className="space-y-1">
              <textarea
                rows={3}
                placeholder="Share your experience with this gear item..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-zinc-200 bg-white p-3 text-xs focus:outline-none focus:border-zinc-900"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmittingReview}
              className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-xs uppercase px-6 h-9 flex items-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmittingReview ? "Submitting..." : "Post Review"}
            </Button>
          </form>

          {/* Reviews List with Inline Edit and Delete */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev: any) => {
                const isEditing = editingReviewId === rev.id;

                return (
                  <div key={rev.id} className="border border-zinc-200 p-4 bg-white space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900">{rev.customer?.name || "Verified Customer"}</span>
                        {!isEditing && (
                          <div className="flex text-amber-500">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                        
                        {/* Edit and Delete Actions */}
                        {!isEditing && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(rev)}
                              className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                              title="Edit Review"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={deletingReviewId === rev.id}
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inline Edit Mode Form */}
                    {isEditing ? (
                      <div className="bg-[#FDFBF7] p-3 border border-zinc-200 space-y-3 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 text-[10px] uppercase">Rating:</span>
                          <select
                            value={editRating}
                            onChange={(e) => setEditRating(Number(e.target.value))}
                            className="border border-zinc-200 bg-white px-2 py-1 text-xs uppercase"
                          >
                            <option value={5}>5 Stars</option>
                            <option value={4}>4 Stars</option>
                            <option value={3}>3 Stars</option>
                            <option value={2}>2 Stars</option>
                            <option value={1}>1 Star</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full border border-zinc-200 bg-white p-2 text-xs focus:outline-none focus:border-zinc-900"
                        />

                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="rounded-none text-[10px] uppercase h-7 px-3 flex items-center gap-1"
                          >
                            <X className="h-3 w-3" /> Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={isUpdatingReview}
                            onClick={() => handleUpdateReview(rev.id)}
                            className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] uppercase h-7 px-3 flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> {isUpdatingReview ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-700 text-xs leading-relaxed">{rev.comment}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-zinc-400 py-8">No reviews yet for this item. Be the first to review!</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}