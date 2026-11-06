// this is API s form Customer

"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerRentalOrder {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: RentalOrderItem[];
}

export async function getCustomerRentalOrders(): Promise<CustomerRentalOrder[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch customer rentals: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.rentalOrders || [];
  } catch (error) {
    console.error("Error fetching customer rental orders:", error);
    return [];
  }
}





export interface CartCheckoutPayload {
  startDate: string;
  endDate: string;
  items: {
    gearItemId: string;
    quantity: number;
  }[];
}

export async function createRentalOrder(payload: CartCheckoutPayload) {
  try {
    // 1. Retrieve authentication cookie/token if your backend requires it
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value; // Adjust token cookie name if necessary

    // 2. Dispatch POST request to your backend rentals endpoint
    const response = await fetch("https://gear-up-ivory-nine.vercel.app/api/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Revalidate your customer portal cache so the new order shows up instantly
      revalidatePath("/customer-cart");
      return {
        success: true,
        message: result.message || "Rental order created successfully!",
        data: result.data,
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to create rental order.",
      };
    }
  } catch (error) {
    console.error("Server action error creating rental order:", error);
    return {
      success: false,
      message: "An unexpected network error occurred while submitting your order.",
    };
  }
}


export async function cancelRentalOrder(orderId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const response = await fetch(
      `https://gear-up-ivory-nine.vercel.app/api/rentals/${orderId}/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      revalidatePath("/customer-cart");
      return {
        success: true,
        message: result.message || "Rental order cancelled successfully!",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to cancel this rental order. Only PLACED or CONFIRMED orders can be cancelled.",
      };
    }
  } catch (error) {
    console.error("Error cancelling rental order:", error);
    return {
      success: false,
      message: "An unexpected network error occurred while cancelling the order.",
    };
  }
}




// get Rental Order Details

export const getRentalOrderDetailsAction = async (
  rentalOrderId: string,
) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required!",
        data: null,
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/rentals/${rentalOrderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch rental order details",
        data: null,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.rentalOrder,
    };
  } catch (error) {
    console.error("Get rental order details error:", error);

    return {
      success: false,
      message: "Something went wrong while fetching rental order details.",
      data: null,
    };
  }
};
