import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MenuItemSkeleton() {
  return (
    <Card className="transition-all duration-200 bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl overflow-hidden">
      <CardContent className="p-3">
        <div className="flex flex-col h-full items-center text-center">
          {/* Icon skeleton */}
          <div className="w-full aspect-square flex items-center justify-center rounded-md mb-3">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          <div className="flex-1 flex flex-col items-center text-center w-full">
            <div className="mb-2 w-full">
              {/* Title skeleton */}
              <Skeleton className="h-4 w-20 mx-auto mb-1" />
              {/* Category badge skeleton */}
              <Skeleton className="h-3 w-16 mx-auto mb-1" />
            </div>

            <div className="mt-auto text-center">
              {/* Price skeleton */}
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
