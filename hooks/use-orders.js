import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// Shared query configuration
const ordersQueryConfig = {
  staleTime: 1 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
};

// Shared mutation handlers
const createOrderMutations = (queryClient) => ({
  addOrder: useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  }),

  updateOrder: useMutation({
    mutationFn: ({ id, ...order }) => apiClient.putWithId("/orders", id, order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  }),

  deleteOrder: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/orders", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  }),
});

export function useOrders() {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.get("/orders"),
    ...ordersQueryConfig,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const mutations = createOrderMutations(queryClient);

  return {
    orders,
    isLoading,
    isError,
    addOrder: mutations.addOrder.mutateAsync,
    updateOrder: mutations.updateOrder.mutateAsync,
    deleteOrder: mutations.deleteOrder.mutateAsync,
  };
}

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
    ...ordersQueryConfig,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: false,
  });

  const mutations = createOrderMutations(queryClient);

  return {
    orders,
    isLoading,
    isError,
    refetch,
    addOrder: mutations.addOrder.mutateAsync,
    updateOrder: mutations.updateOrder.mutateAsync,
    deleteOrder: mutations.deleteOrder.mutateAsync,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order) => apiClient.post("/orders", order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}
