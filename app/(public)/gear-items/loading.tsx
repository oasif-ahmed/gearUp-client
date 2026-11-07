import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Layers, ShieldCheck, MessageSquare } from "lucide-react";

export default function GearItemDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] dark:bg-[#1a1918] text-[#2c2a29] dark:text-[#f4f1ea] py-10 font-mono text-xs transition-colors duration-300">
      
      {/* Navigation Header Skeleton */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between border-b border-[#e2ddd3] dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-1.5 text-[#6b655f] dark:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            <Skeleton className="h-4 w-32 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
          </div>
          <Skeleton className="h-4 w-24 bg-[#d8d2c6]/40 dark:bg-zinc-800/60 rounded-none" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        
        {/* Hero Section Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Media Showcase Skeleton */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#ede8df] dark:bg-zinc-800/80 border border-[#d8d2c6] dark:border-zinc-700 p-6 shadow-sm">
            <div className="relative w-full flex-1 min-h-[380px] overflow-hidden bg-[#f4f1ea] dark:bg-zinc-900 mb-4 border border-[#d8d2c6] dark:border-zinc-700 p-4 flex flex-col justify-between">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
                <Skeleton className="h-5 w-24 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
              </div>
              <Skeleton className="w-full h-48 bg-[#d8d2c6]/40 dark:bg-zinc-800/50 rounded-none" />
            </div>

            {/* Thumbnail row */}
            <div className="flex gap-3 pt-2 border-t border-[#d8d2c6] dark:border-zinc-700">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none shrink-0" />
              ))}
            </div>
          </div>

          {/* Invoice Summary & Cart Action Skeleton */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#ede8df] dark:bg-zinc-800/80 border border-[#d8d2c6] dark:border-zinc-700 p-8 shadow-sm space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
                <Skeleton className="h-3 w-3 bg-[#d8d2c6]/40 dark:bg-zinc-800 rounded-none" />
                <Skeleton className="h-3 w-24 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
              </div>
              <Skeleton className="h-8 w-3/4 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
              <div className="space-y-1.5 pt-2 border-b border-[#d8d2c6] dark:border-zinc-700 pb-6">
                <Skeleton className="h-3 w-full bg-[#d8d2c6]/40 dark:bg-zinc-800/60 rounded-none" />
                <Skeleton className="h-3 w-5/6 bg-[#d8d2c6]/40 dark:bg-zinc-800/60 rounded-none" />
              </div>
            </div>

            {/* Price Box */}
            <div className="space-y-3 bg-[#f4f1ea] dark:bg-zinc-900 p-4 border border-[#d8d2c6] dark:border-zinc-700">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-28 bg-[#d8d2c6]/60 dark:bg-zinc-800 rounded-none" />
                <Skeleton className="h-5 w-20 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-36 bg-[#d8d2c6]/40 dark:bg-zinc-800/60 rounded-none" />
                <Skeleton className="h-3 w-16 bg-[#d8d2c6]/40 dark:bg-zinc-800/60 rounded-none" />
              </div>
            </div>

            {/* Action button */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-11 w-full bg-[#2c2a29]/20 dark:bg-zinc-100/20 rounded-none" />
              <Skeleton className="h-3 w-48 mx-auto bg-[#d8d2c6]/40 dark:bg-zinc-800/40 rounded-none" />
            </div>
          </div>
        </div>

        {/* Technical Specs & Safeguards Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          <div className="md:col-span-7 bg-[#ede8df] dark:bg-zinc-800/80 border border-[#d8d2c6] dark:border-zinc-700 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#d8d2c6] dark:border-zinc-700 pb-3">
              <Layers className="h-4 w-4 text-[#5a6b5c]" />
              <Skeleton className="h-4 w-44 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-[#d8d2c6]/40 dark:border-zinc-800">
                  <Skeleton className="h-3 w-28 bg-[#d8d2c6]/50 dark:bg-zinc-800 rounded-none" />
                  <Skeleton className="h-3 w-32 bg-[#d8d2c6]/70 dark:bg-zinc-700 rounded-none" />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 bg-[#ede8df] dark:bg-zinc-800/80 border border-[#d8d2c6] dark:border-zinc-700 p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#d8d2c6] dark:border-zinc-700 pb-3">
              <ShieldCheck className="h-4 w-4 text-[#5a6b5c]" />
              <Skeleton className="h-4 w-40 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
            </div>
            <div className="space-y-4 pt-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-32 bg-[#d8d2c6]/70 dark:bg-zinc-700 rounded-none" />
                  <Skeleton className="h-3 w-full bg-[#d8d2c6]/40 dark:bg-zinc-800 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="bg-[#ede8df] dark:bg-zinc-800/80 border border-[#d8d2c6] dark:border-zinc-700 p-8 shadow-sm space-y-6">
          <div className="border-b border-[#d8d2c6] dark:border-zinc-700 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#5a6b5c]" />
              <Skeleton className="h-4 w-48 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-[#f4f1ea] dark:bg-zinc-900 p-6 border border-[#d8d2c6] dark:border-zinc-700 space-y-4">
            <Skeleton className="h-4 w-36 bg-[#d8d2c6]/80 dark:bg-zinc-700 rounded-none" />
            <Skeleton className="h-9 w-40 bg-[#ede8df] dark:bg-zinc-800 rounded-none" />
            <Skeleton className="h-20 w-full bg-[#ede8df] dark:bg-zinc-800 rounded-none" />
            <Skeleton className="h-9 w-32 bg-[#2c2a29]/20 dark:bg-zinc-100/20 rounded-none" />
          </div>

          {/* Review items list skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="border border-[#d8d2c6] dark:border-zinc-700 p-4 bg-[#f4f1ea] dark:bg-zinc-900 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-32 bg-[#d8d2c6]/70 dark:bg-zinc-700 rounded-none" />
                  <Skeleton className="h-3 w-16 bg-[#d8d2c6]/40 dark:bg-zinc-800 rounded-none" />
                </div>
                <Skeleton className="h-3 w-full bg-[#d8d2c6]/50 dark:bg-zinc-800 rounded-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}