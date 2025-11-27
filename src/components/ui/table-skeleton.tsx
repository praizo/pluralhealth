import { Skeleton } from "./skeleton";

 
export function TableSkeleton() {
  return (
    <div>
      {/* Table Controls Skeleton */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[1200px]">
          {/* Header */}
          <div className="grid grid-cols-[40px_4.2fr_1.5fr_2fr_2fr_1.5fr_3fr_20px] gap-4 px-6 py-3 mb-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[40px_4.2fr_1.5fr_2fr_2fr_1.5fr_3fr_20px] gap-4 items-center bg-white rounded-2xl py-4 px-6 border-l-6 border-gray-100"
              >
                <Skeleton className="h-4 w-4" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-6 w-12 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
