import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Query configuration
const ordersQueryConfig = {
  staleTime: 1 * 60 * 1000, // 1 minute
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

// Mutation handlers
const createOrderMutations = (queryClient) => ({
  addOrder: useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order");
    },
  }),

  updateOrder: useMutation({
    mutationFn: ({ id, ...order }) => apiClient.putWithId("/orders", id, order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order");
    },
  }),

  deleteOrder: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/orders", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete order");
    },
  }),
});

export function useOrders() {
  const queryClient = useQueryClient();

  // Fetch orders
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
    ...ordersQueryConfig,
  });

  const mutations = createOrderMutations(queryClient);

  return {
    // Data
    orders,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    addOrder: mutations.addOrder.mutateAsync,
    updateOrder: mutations.updateOrder.mutateAsync,
    deleteOrder: mutations.deleteOrder.mutateAsync,

    // Mutation states
    isAdding: mutations.addOrder.isPending,
    isUpdating: mutations.updateOrder.isPending,
    isDeleting: mutations.deleteOrder.isPending,
  };
}

export function useLazyOrders() {
  const queryClient = useQueryClient();

  // Fetch orders with lazy loading
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
    ...ordersQueryConfig,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: false,
  });

  const mutations = createOrderMutations(queryClient);

  return {
    // Data
    orders,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    refetch,
    addOrder: mutations.addOrder.mutateAsync,
    updateOrder: mutations.updateOrder.mutateAsync,
    deleteOrder: mutations.deleteOrder.mutateAsync,

    // Mutation states
    isAdding: mutations.addOrder.isPending,
    isUpdating: mutations.updateOrder.isPending,
    isDeleting: mutations.deleteOrder.isPending,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create order");
    },
  });
}
