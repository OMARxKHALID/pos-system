import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      return res.json();
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}
