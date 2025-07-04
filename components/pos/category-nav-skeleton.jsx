import { Skeleton } from "@/components/ui/skeleton";

export function CategoryNavSkeleton() {
  return (
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex flex-col items-start p-2 rounded-2xl w-[90px] h-[90px] sm:w-[105px] sm:h-[105px] border-2 flex-shrink-0 bg-white"
        >
          {/* Icon skeleton */}
          <div className="mb-2 sm:mb-3">
            <Skeleton className="w-7 h-7 sm:w-9 sm:h-9 rounded-full" />
          </div>

          <div className="flex flex-col text-left w-full">
            {/* Category name skeleton */}
            <Skeleton className="h-3 w-12 mb-1" />
            {/* Item count skeleton */}
            <Skeleton className="h-2 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
