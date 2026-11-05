import React from "react";
import { getCategories } from "@/services/provider.service";
import { getAllGearItems } from "@/services/gear-item.service";
import { getMe } from "@/services/getMe";
import ProviderDashboard from "./ProviderDashboard";


export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderAsyncPage = async () => {
  const [categories, gearItemsResponse, currentUser] = await Promise.all([
    getCategories(),
    getAllGearItems(),
    getMe(),
  ]);

  const gearItems = gearItemsResponse.data.gearItems;
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
      />
    </div>
  );
};

export default ProviderAsyncPage;
