import { Skeleton } from "@/components/ui/skeleton";

export function SearchBarSkeleton() {
  return (
    <div className="relative mb-4">
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}
