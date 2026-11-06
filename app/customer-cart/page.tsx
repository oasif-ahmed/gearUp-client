import {
  getCustomerRentalOrders,
  createRentalOrder,
  cancelRentalOrder,
  getRentalOrderDetailsAction,
} from "@/services/rental-order.service";

import { getAllGearItems } from "@/services/gear-item.service";

import CustomerCart from "./customerCart";

export default async function CustomerCartPage() {
  const [rentalOrders, gearItemsResponse] = await Promise.all([
    getCustomerRentalOrders(),
    getAllGearItems(),
  ]);

  const gearItems =
    gearItemsResponse.data?.gearItems ||
    gearItemsResponse.gearItems ||
    [];

  return (
    <main className="min-h-screen bg-background">
      <CustomerCart
        rentalOrders={rentalOrders}
        gearItems={gearItems}
        createRentalOrderAction={createRentalOrder}
        cancelRentalOrderAction={cancelRentalOrder}
        getRentalOrderDetailsAction={getRentalOrderDetailsAction}
      />
    </main>
  );
}