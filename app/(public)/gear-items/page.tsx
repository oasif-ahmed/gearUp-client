import { getAllGearItems } from "@/services/gear-item.service";
import GearItemCard from "@/components/gear/gearItemCard";
import Link from "next/link";

export default async function GearItemsPage() {
  const response = await getAllGearItems();
  const gearItems = response.data.gearItems;

  return (
    <div className="min-h-screen dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Available Gear Items
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse our collection of high-quality gear for your next adventure
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gearItems.map((item) => (
            <Link href={`/gear-items/${item.id}`} key={item.id} className="block transition-transform hover:-translate-y-1">
              <GearItemCard {...item} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}