import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useAnalytics() {
  return useQuery({
    queryKey: ["report"],
    queryFn: () => apiClient.get("/report"),
  });
}
