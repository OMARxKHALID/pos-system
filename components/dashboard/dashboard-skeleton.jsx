import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        {/* Breadcrumb Skeleton */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded" />
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded" />
          <Skeleton className="w-8 sm:w-12 h-3 sm:h-4 rounded" />
          <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 rounded" />
          <Skeleton className="w-16 sm:w-20 h-3 sm:h-4 rounded" />
        </nav>

        {/* Main Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-200 rounded-lg sm:rounded-xl">
                <Skeleton className="w-4 h-4 sm:w-6 sm:h-6 rounded" />
              </div>
              <div>
                <Skeleton className="h-6 sm:h-8 lg:h-9 w-32 sm:w-40 lg:w-48 rounded mb-1" />
                <Skeleton className="h-3 sm:h-4 lg:h-5 w-48 sm:w-64 lg:w-80 rounded" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Skeleton className="w-16 sm:w-20 h-6 sm:h-8 rounded-full" />
            <Skeleton className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl" />
          </div>
        </div>
      </div>

      {/* Dashboard Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 shadow-sm rounded-lg p-4"
          >
            <div className="flex items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20 rounded" />
              <div className="p-2 rounded-lg bg-gray-200">
                <Skeleton className="w-4 h-4 rounded" />
              </div>
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-24 rounded" />
              <div className="flex items-center gap-1">
                <Skeleton className="w-3 h-3 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart with Earnings Cards Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          {/* Earnings Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm border-0 rounded-lg p-3 sm:p-4 lg:p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 rounded mb-2" />
                    <Skeleton className="h-6 sm:h-8 lg:h-9 xl:h-10 w-24 sm:w-32 lg:w-36 xl:w-40 rounded" />
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-gray-200 rounded-lg">
                    <Skeleton className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sales Chart Skeleton */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
            <div className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-3 sm:flex-row sm:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 sm:space-y-0">
              <div className="flex items-center gap-2">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="h-5 w-32 rounded" />
              </div>
            </div>
            <div className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
              <Skeleton className="h-[320px] w-[536px] max-w-full rounded" />
            </div>
          </div>
        </div>

        {/* Top Products Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          <div className="flex flex-row items-center justify-between px-4 pt-4 pb-3 sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-5 w-32 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-48 h-8 rounded" />
            </div>
          </div>
          <div className="px-4 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
            {/* Desktop Table Skeleton */}
            <div className="hidden md:block">
              <div className="space-y-3">
                {/* Table Header */}
                <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                  <Skeleton className="w-10 h-4 rounded" />
                  <Skeleton className="w-24 h-4 rounded" />
                  <div className="flex-1" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
                {/* Table Rows */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 py-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-8 rounded" />
                      <Skeleton className="h-3 w-6 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mobile Card Skeleton */}
            <div className="md:hidden space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <div className="flex-shrink-0 text-right space-y-1">
                    <Skeleton className="h-4 w-8 rounded" />
                    <Skeleton className="h-3 w-6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
