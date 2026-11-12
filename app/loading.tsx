import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background py-6 px-4 text-foreground">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-20 bg-muted" />
          <span className="text-xs text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>

        {/* Top Grid Split: Image + Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left: Main Image Box Skeleton */}
          <div className="lg:col-span-5 border border-border bg-card p-3 space-y-3">
            <Skeleton className="w-full aspect-square bg-muted rounded-none" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12 bg-muted rounded-none" />
              <Skeleton className="h-12 w-12 bg-muted rounded-none" />
              <Skeleton className="h-12 w-12 bg-muted rounded-none" />
            </div>
          </div>

          {/* Right: High-Density Meta & Pricing Hub Skeleton */}
          <div className="lg:col-span-7 border border-border bg-card p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Header & Price */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-16 bg-muted" />
                  <Skeleton className="h-8 w-3/4 bg-muted" />
                </div>
                <Skeleton className="h-8 w-20 bg-muted" />
              </div>

              {/* Description line */}
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-2/3 bg-muted" />

              {/* 3-Column Spec Box Skeleton */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Skeleton className="h-12 w-full bg-muted" />
                <Skeleton className="h-12 w-full bg-muted" />
                <Skeleton className="h-12 w-full bg-muted" />
              </div>

              {/* Stock Bar Placeholder */}
              <Skeleton className="h-10 w-full bg-muted" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1 bg-muted" />
              <Skeleton className="h-9 w-24 bg-muted" />
            </div>
          </div>

        </div>

        {/* Bottom Multi-Column Specs Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-32 bg-muted" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
            </div>
          </div>
          
          <div className="border border-border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-32 bg-muted" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
              <Skeleton className="h-10 w-full bg-muted" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}