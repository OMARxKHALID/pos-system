import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Query configuration
const dashboardQueryConfig = {
  staleTime: 1 * 60 * 1000, // 1 minute (reduced from 10 minutes)
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: true, // Enable refetch on window focus
  refetchOnMount: true, // Enable refetch on mount
  refetchOnReconnect: true, // Enable refetch on reconnect
};

export function useDashboard() {
  // Fetch dashboard data
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.get("/dashboard"),
    ...dashboardQueryConfig,
  });

  return {
    // Data
    data,

    // Loading states
    isLoading,
    isError,
    error,

    // Refresh functions
    refetch,
    isRefetching,
  };
}
