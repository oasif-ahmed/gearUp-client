
import { getAllGearItems } from "@/services/gear-item.service";
import GearItemCard from "@/components/gear/gearItemCard";
import GearSearchBar from "@/components/gear/gearSearchBar";
import Link from "next/link";
import { Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function GearItemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const resolvedSearchParams = await searchParams;

  const searchQuery =
    typeof resolvedSearchParams.search === "string"
      ? resolvedSearchParams.search.toLowerCase()
      : "";

  const statusFilter =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "ALL";

  const sortBy =
    typeof resolvedSearchParams.sort === "string"
      ? resolvedSearchParams.sort
      : "default";

  let gearItems = [];

  try {
    const response = await getAllGearItems();
    gearItems = response?.data?.gearItems || [];
  } catch (err) {
    console.error("Failed to fetch gear items", err);
  }

  // Filtering Logic
  let filteredItems = gearItems.filter((item: any) => {
    const matchesSearch =
      !searchQuery ||
      item.name?.toLowerCase().includes(searchQuery) ||
      item.description?.toLowerCase().includes(searchQuery) ||
      item.category?.toLowerCase().includes(searchQuery) ||
      item.location?.toLowerCase().includes(searchQuery);

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "AVAILABLE" && item.isAvailable) ||
      (statusFilter === "RENTED" && !item.isAvailable);

    return matchesSearch && matchesStatus;
  });

  // Sorting Logic
  if (sortBy === "price-low") {
    filteredItems.sort(
      (a: any, b: any) =>
        (a.pricePerDay || 0) - (b.pricePerDay || 0)
    );
  } else if (sortBy === "price-high") {
    filteredItems.sort(
      (a: any, b: any) =>
        (b.pricePerDay || 0) - (a.pricePerDay || 0)
    );
  } else if (sortBy === "newest") {
    filteredItems.sort(
      (a: any, b: any) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] text-zinc-900 selection:bg-zinc-900 selection:text-[#FDFBF7] font-mono">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Header Title Section */}
        <div className="space-y-3 border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 border border-zinc-200 text-xs font-mono uppercase tracking-wider text-zinc-600">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              Inventory Directory
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-tight text-zinc-900">
              Available Gear Items
            </h1>
          </div>

          <div className="bg-white border border-zinc-200 px-3 py-2 shadow-2xs flex items-center gap-2 text-xs">
            <Package className="h-3.5 w-3.5 text-zinc-900" />

            <span className="uppercase text-zinc-600">
              Found:{" "}
              <strong className="text-zinc-900">
                {filteredItems.length}
              </strong>{" "}
              items
            </span>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <div className="flex justify-end">
          <GearSearchBar defaultValue={searchQuery} />
        </div>

        {/* Active Filter Badges */}
        {(searchQuery || statusFilter !== "ALL") && (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 pt-1 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Active:
            </span>

            {searchQuery && (
              <Badge
                variant="outline"
                className="rounded-none text-[10px] border-zinc-300 bg-white"
              >
                Keyword: &quot;{searchQuery}&quot;
              </Badge>
            )}

            {statusFilter !== "ALL" && (
              <Badge
                variant="outline"
                className="rounded-none text-[10px] border-zinc-300 bg-white"
              >
                Status: {statusFilter}
              </Badge>
            )}

            <Link
              href="/gear-items"
              className="text-[11px] underline text-zinc-700 ml-2"
            >
              Clear filters
            </Link>
          </div>
        )}

        {/* Gear Grid Results */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredItems.map((item: any) => (
              <Link
                href={`/gear-items/${item.id}`}
                key={item.id}
                className="group block h-full"
              >
                {/* Only the GearItemCard - no extra white wrapper */}
                <GearItemCard {...item} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 p-16 text-center space-y-4">
            <Package className="h-12 w-12 text-zinc-300 mx-auto" />

            <h3 className="text-lg font-serif font-bold text-zinc-900">
              No equipment found
            </h3>

            <p className="text-xs text-zinc-500 font-mono max-w-sm mx-auto">
              We couldn&apos;t find any items matching your search.
              Try adjusting your search.
            </p>

            <div className="pt-2">
              <Button
                asChild
                className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase font-mono"
              >
                <Link href="/gear-items">
                  Reset All Filters
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
