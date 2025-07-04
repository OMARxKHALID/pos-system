import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addOrder = useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, ...order }) => apiClient.putWithId("/orders", id, order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/orders", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  return {
    orders,
    isLoading,
    isError,
    addOrder: addOrder.mutateAsync,
    updateOrder: updateOrder.mutateAsync,
    deleteOrder: deleteOrder.mutateAsync,
  };
}

// Lazy loading version - only fetches when explicitly called
export function useLazyOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: false, // Don't fetch automatically
  });

  const addOrder = useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, ...order }) => apiClient.putWithId("/orders", id, order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/orders", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });

  return {
    orders,
    isLoading,
    isError,
    refetch,
    addOrder: addOrder.mutateAsync,
    updateOrder: updateOrder.mutateAsync,
    deleteOrder: deleteOrder.mutateAsync,
  };
}

// Create order mutation hook (for order-cart component)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
    },
  });
}
