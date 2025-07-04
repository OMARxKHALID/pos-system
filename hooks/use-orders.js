import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}
