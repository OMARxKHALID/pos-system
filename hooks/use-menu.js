import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const menuQueryConfig = {
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

const createMenuMutations = (queryClient) => ({
  addMenuItem: useMutation({
    mutationFn: (item) => apiClient.post("/menu", item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  }),

  updateMenuItem: useMutation({
    mutationFn: ({ id, ...item }) => apiClient.putWithId("/menu", id, item),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  }),

  deleteMenuItem: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/menu", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu"] }),
  }),
});

export function useMenu() {
  const queryClient = useQueryClient();

  const {
    data: menuItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => apiClient.get("/menu"),
    ...menuQueryConfig,
  });

  const mutations = createMenuMutations(queryClient);

  return {
    menuItems,
    isLoading,
    isError,
    addMenuItem: mutations.addMenuItem.mutateAsync,
    updateMenuItem: mutations.updateMenuItem.mutateAsync,
    deleteMenuItem: mutations.deleteMenuItem.mutateAsync,
  };
}
