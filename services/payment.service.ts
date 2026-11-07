
"use server";

import { cookies } from "next/headers";

export const createPaymentAction = async (rentalOrderId: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required. Please log in again.",
      };
    }

    if (!rentalOrderId) {
      return {
        success: false,
        message: "Rental order ID is required.",
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        rentalOrderId,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to initialize payment.",
      };
    }

    return {
      success: true,
      message: result.message || "Payment initialized successfully.",
      data: result.data,
    };
  } catch (error) {
    console.error("Create payment action error:", error);

    return {
      success: false,
      message: "Something went wrong while creating payment.",
    };
  }
};


// payment history

export const getPaymentHistoryAction = async () => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required.",
        data: null,
      };
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/api/payments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to fetch payment history.",
        data: null,
      };
    }

    return result;
  } catch (error) {
    console.error("Get payment history error:", error);

    return {
      success: false,
      message: "Something went wrong while fetching payment history.",
      data: null,
    };
  }
};