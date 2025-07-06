import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const dashboardQueryConfig = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

export function useDashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiClient.get("/dashboard"),
    ...dashboardQueryConfig,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
}
