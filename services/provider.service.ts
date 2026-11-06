"use server";

import { cookies } from "next/headers";

export const getCategories = async () => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories`, {
        cache: "no-store"
    });

    if(!res.ok){
        throw new Error("Categories not found!.")
    }
    const result = await res.json();

    return result.data.categories;
}


// get Provider rental Order

interface GearItem {
  id: string;
  name: string;
  brand: string;
  images: string[];
}

interface RentalOrderItem {
  id: string;
  quantity: number;
  pricePerDay: string;
  gearItem: GearItem;
}

interface Customer {
  name: string;
  email: string;
}

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  customer: Customer;
  items: RentalOrderItem[];
}

export async function getProviderRentalOrders(): Promise<RentalOrder[]> {
    const cookieStore =  await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders`, {
      headers: {
      Authorization: `Bearer ${accessToken}`,
    },
      cache: 'no-store', // Or 'force-cache' depending on your caching strategy
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch rental orders: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.rentalOrders;
  } catch (error) {
    console.error("Error fetching rental orders:", error);
    // In a real application, you might return an empty array or a specific error object
    return [];
  }
}