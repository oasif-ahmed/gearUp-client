import AdminDashboard from "./adminClient";
import {
  getAllUsers,
  updateUserStatus,
  getAllAdminGear,
  getAllAdminRentalOrders,
  createCategory,
  getCategoriesWithGear,
} from "@/services/admin.service";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch all required administrative data concurrently on the server
  const [users, gearItems, rentalOrders, categories] = await Promise.all([
    getAllUsers(),
    getAllAdminGear(),
    getAllAdminRentalOrders(),
    getCategoriesWithGear(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <AdminDashboard
        users={users}
        gearItems={gearItems}
        rentalOrders={rentalOrders}
        categories={categories}
        onUpdateUserStatus={updateUserStatus}
        onCreateCategory={createCategory}
      />
    </main>
  );
}