"use server";

import { cookies } from "next/headers";

export const getAllGearItems = async () => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/gear`, {
    cache: "no-store"
  });

  if(!res.ok) {
    throw new Error("Failed to fetch gear Items.");
  }
  return res.json();
}

export const getGearItemById = async (id: string) => {
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/gear/${id}`, {
    cache: "no-store"
  });

  if(!res.ok){
    throw new Error("Failed to fetch gear item details")
  }

  const result = await res.json();

  return result.data.gearItem;
}


// add Gear from PROVIDER

export const addGearItem = async () => {
  const cookieStore = await cookies();
  const accessToken = await cookieStore.get("accessToken").value;
}