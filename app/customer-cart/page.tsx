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

import { getMyReviews } from "@/services/review.service";

import CustomerCart from "./customerCart";

export const dynamic = 'force-dynamic';

export default async function CustomerCartPage() {
  const [rentalOrders, gearItemsResponse, paymentHistory, myReviews] =
    await Promise.all([
      getCustomerRentalOrders(),
      getAllGearItems(),
      getPaymentHistoryAction(),
      getMyReviews(),
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
        myReviews={myReviews}
        createRentalOrderAction={createRentalOrder}
        cancelRentalOrderAction={cancelRentalOrder}
        getRentalOrderDetailsAction={getRentalOrderDetailsAction}
        createPaymentAction={createPaymentAction}
      />
    </main>
  );
}