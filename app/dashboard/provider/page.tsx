import React from "react";
import { getCategories, getProviderRentalOrders, updateRentalOrderStatusAction } from "@/services/provider.service";
import { getAllGearItems } from "@/services/gear-item.service";
import { getMe } from "@/services/getMe";
import ProviderDashboard from "./ProviderDashboard-aligned";


export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderAsyncPage = async () => {
  const [categories, gearItemsResponse, currentUser, rentalOrdersResponse] = await Promise.all([
    getCategories(),
    getAllGearItems(),
    getMe(),
    getProviderRentalOrders(),
  ]);

  const gearItems = gearItemsResponse.data.gearItems;
  const rentalOrders = rentalOrdersResponse;
  const currentUserId = currentUser?.id;
  if (!currentUserId) {
    return <div>Please log in to access your provider dashboard.</div>;
  }

  return (
    <div>
      <ProviderDashboard
        categories={categories}
        gearItems={gearItems}
        currentUserId={currentUserId}
        rentalOrders={rentalOrders}
      />
    </div>
  );
};

export default ProviderAsyncPage;
 