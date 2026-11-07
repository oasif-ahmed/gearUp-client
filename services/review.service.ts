"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface CreateReviewPayload {
  gearItemId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

// 1. Create a Review
export async function createReview(payload: CreateReviewPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      revalidatePath(`/gear-items/${payload.gearItemId}`);
      return {
        success: true,
        message: result.message || "Review created successfully!",
        data: result.data?.review,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to create review.",
      };
    }
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: "An unexpected error occurred while posting your review.",
    };
  }
}

// 2. Get Reviews for a Specific Gear Item
export async function getReviewsForGear(gearItemId: string) {
  try {
    const res = await fetch(`https://gear-up-ivory-nine.vercel.app/api/reviews/gear/${gearItemId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Ensure fresh data on request
    });

    const data = await res.json();
    return data?.success ? data.data?.reviews || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching reviews for gear:", err);
    return [];
  }
}

// 3. Get Logged-in Customer's Reviews
export async function getMyReviews() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/reviews/my-reviews", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: 0 },
    });

    const data = await res.json();
    return data?.success ? data.data?.reviews || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching my reviews:", err);
    return [];
  }
}

// 4. Update an Existing Review
export async function updateReview(reviewId: string, payload: UpdateReviewPayload) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`https://gear-up-ivory-nine.vercel.app/api/reviews/${reviewId}`, {
      method: "PATCH", // Using PATCH or PUT depending on your backend routing
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      revalidatePath("/customer/reviews");
      return {
        success: true,
        message: result.message || "Review updated successfully!",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to update review.",
      };
    }
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the review.",
    };
  }
}

// 5. Delete a Review
export async function deleteReview(reviewId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`https://gear-up-ivory-nine.vercel.app/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await res.json();

    if (res.ok && result.success) {
      revalidatePath("/customer/reviews");
      return {
        success: true,
        message: result.message || "Review deleted successfully!",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to delete review.",
      };
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: "An unexpected error occurred while deleting the review.",
    };
  }
}