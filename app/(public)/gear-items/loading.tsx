import { Skeleton } from "@/components/ui/skeleton";
import { Grid, Search, SlidersHorizontal } from "lucide-react";

export default function GearItemsLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl px-4 mx-auto space-y-6">
        
        {/* Editorial Top Header Skeleton */}
        <div className="border-b border-zinc-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
              <Grid className="h-3.5 w-3.5" /> Catalog Index
            </div>
            <Skeleton className="h-9 w-64 bg-zinc-200/80 rounded-none" />
          </div>
          <Skeleton className="h-4 w-48 bg-zinc-200/50 rounded-none" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 border border-zinc-200">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-300" />
            <Skeleton className="h-9 w-full bg-zinc-100 rounded-none" />
          </div>
          <Skeleton className="h-9 w-24 bg-zinc-100 rounded-none shrink-0" />
        </div>

        {/* Dense Grid of Card Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="border border-zinc-200 bg-white p-3 space-y-3 flex flex-col justify-between"
            >
              {/* Image Skeleton */}
              <div className="relative aspect-4/3 bg-zinc-100 overflow-hidden">
                <Skeleton className="w-full h-full rounded-none bg-zinc-200/60" />
                <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                  <Skeleton className="h-4 w-12 bg-white/80 rounded-none" />
                  <Skeleton className="h-4 w-14 bg-white/80 rounded-none" />
                </div>
              </div>

              {/* Title & Price Skeleton */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <Skeleton className="h-4 w-3/4 bg-zinc-200/80 rounded-none" />
                  <Skeleton className="h-4 w-12 bg-zinc-200/80 rounded-none" />
                </div>
                <Skeleton className="h-3 w-1/2 bg-zinc-200/50 rounded-none" />
              </div>

              {/* Specification Pills Skeleton */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Skeleton className="h-6 w-full bg-zinc-100 rounded-none" />
                <Skeleton className="h-6 w-full bg-zinc-100 rounded-none" />
              </div>

              {/* Action Button Skeleton */}
              <Skeleton className="h-8 w-full bg-zinc-900/10 rounded-none mt-2" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}