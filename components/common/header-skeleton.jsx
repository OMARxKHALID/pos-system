import { Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function HeaderDateTimeSkeleton() {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export function StatusIndicatorSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-3 w-12 rounded" />
    </div>
  );
}
