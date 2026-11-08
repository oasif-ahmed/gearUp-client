"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    // Extract users array safely from data.users
    return data?.success ? data.data?.users || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}

export async function updateUserStatus(userId: string, activeStatus: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ activeStatus }),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      revalidatePath("/dashboard/admin");
      return { success: true, message: result.message || "User status updated successfully!" };
    } else {
      return { success: false, message: result.message || "Failed to update user status." };
    }
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getAllAdminGear() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/admin/gear", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    // Extract gearItems array safely from data.gearItems
    return data?.success ? data.data?.gearItems || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching admin gear:", err);
    return [];
  }
}

export async function getAllAdminRentalOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/admin/rentals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    // Extract rentalOrders array safely from data.rentalOrders
    return data?.success ? data.data?.rentalOrders || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching admin rentals:", err);
    return [];
  }
}

export async function createCategory(payload: { name: string; description: string; image?: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      revalidatePath("/dashboard/admin");
      return { success: true, message: result.message || "Category created successfully!" };
    } else {
      return { success: false, message: result.message || "Failed to create category." };
    }
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function getCategoriesWithGear() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const res = await fetch("https://gear-up-ivory-nine.vercel.app/api/admin/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await res.json();
    // Extract categories array safely from data.categories
    return data?.success ? data.data?.categories || data.data || [] : [];
  } catch (err) {
    console.error("Error fetching categories with gear:", err);
    return [];
  }
}