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

export interface AddGearState {
  success: boolean;
  message: string;
}

const getFormString = (formData: FormData, key: string): string => {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
};

export const addGearItem = async (
  _prevState: AddGearState,
  formData: FormData,
): Promise<AddGearState> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false,
        message: "Unauthorized: Missing access token.",
      };
    }

    const imageBBKey = process.env.IMAGE_BB_API_KEY || process.env.IMGBB_API_KEY;

    if (!imageBBKey) {
      throw new Error("ImageBB API key is missing. Check IMAGE_BB_API_KEY or IMGBB_API_KEY.");
    }

    const imageFiles = formData
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);

    // Upload all selected images to ImageBB first.
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        const imageFormData = new FormData();
        imageFormData.append("image", file);

        const imageResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${imageBBKey}`,
          {
            method: "POST",
            body: imageFormData,
          },
        );

        const imageResult = await imageResponse.json().catch(() => null);

        if (!imageResponse.ok || !imageResult?.success) {
          throw new Error(
            imageResult?.error?.message || `ImageBB upload failed for ${file.name}.`,
          );
        }

        const imageUrl = imageResult?.data?.display_url || imageResult?.data?.url;

        if (!imageUrl || typeof imageUrl !== "string") {
          throw new Error(`ImageBB did not return a valid URL for ${file.name}.`);
        }

        return imageUrl;
      }),
    );

    let specifications: Record<string, string>;

    try {
      const parsedSpecifications = JSON.parse(
        getFormString(formData, "specifications") || "{}",
      );

      if (
        !parsedSpecifications ||
        typeof parsedSpecifications !== "object" ||
        Array.isArray(parsedSpecifications)
      ) {
        throw new Error("Specifications must be an object.");
      }

      specifications = parsedSpecifications as Record<string, string>;
    } catch {
      return {
        success: false,
        message: "Invalid technical specifications data.",
      };
    }

    const gearData = {
      name: getFormString(formData, "name"),
      description: getFormString(formData, "description"),
      brand: getFormString(formData, "brand"),
      categoryId: getFormString(formData, "categoryId"),
      condition: getFormString(formData, "condition"),
      pricePerDay: Number(getFormString(formData, "pricePerDay")),
      securityDeposit: Number(getFormString(formData, "securityDeposit")),
      quantity: Number(getFormString(formData, "quantity")),
      status: getFormString(formData, "status"),
      images: imageUrls,
      specifications,
    };

    if (
      !gearData.name ||
      !gearData.description ||
      !gearData.brand ||
      !gearData.categoryId ||
      !gearData.condition ||
      !gearData.status
    ) {
      return {
        success: false,
        message: "Please complete all required fields.",
      };
    }

    const allowedConditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR"] as const;
    const allowedStatuses = ["AVAILABLE", "NOT_AVAILABLE"] as const;

    if (!allowedConditions.includes(gearData.condition as (typeof allowedConditions)[number])) {
      return {
        success: false,
        message: "Invalid gear condition. Please select a valid condition.",
      };
    }

    if (!allowedStatuses.includes(gearData.status as (typeof allowedStatuses)[number])) {
      return {
        success: false,
        message: "Invalid gear status. Please select a valid status.",
      };
    }

    if (
      !Number.isFinite(gearData.pricePerDay) ||
      gearData.pricePerDay <= 0 ||
      !Number.isFinite(gearData.securityDeposit) ||
      gearData.securityDeposit < 0 ||
      !Number.isInteger(gearData.quantity) ||
      gearData.quantity < 1
    ) {
      return {
        success: false,
        message: "Please provide valid price, deposit, and quantity values.",
      };
    }

    const backendUrl = process.env.BACKEND_API_URL;

    if (!backendUrl) {
      throw new Error("BACKEND_API_URL is not configured.");
    }

    const response = await fetch(`${backendUrl}/api/provider/gear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(gearData),
      cache: "no-store",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || "Failed to create gear item.",
      };
    }

    return {
      success: true,
      message: result?.message || "Gear item created successfully!",
    };
  } catch (error) {
    console.error("Error in addGearItem Server Action:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while adding gear.",
    };
  }
};
