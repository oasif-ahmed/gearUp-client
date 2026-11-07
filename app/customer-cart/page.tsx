import {
  getCustomerRentalOrders,
  createRentalOrder,
  cancelRentalOrder,
  getRentalOrderDetailsAction,
} from "@/services/rental-order.service";

import { getAllGearItems } from "@/services/gear-item.service";

import {
  createPaymentAction,
  getPaymentHistoryAction,
} from "@/services/payment.service";

import CustomerCart from "./customerCart";

export default async function CustomerCartPage() {
  const [rentalOrders, gearItemsResponse, paymentHistory] =
    await Promise.all([
      getCustomerRentalOrders(),
      getAllGearItems(),
      getPaymentHistoryAction(),
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
        paymentHistory={paymentHistory}
        createRentalOrderAction={createRentalOrder}
        cancelRentalOrderAction={cancelRentalOrder}
        getRentalOrderDetailsAction={getRentalOrderDetailsAction}
        createPaymentAction={createPaymentAction}
      />
    </main>
  );
}