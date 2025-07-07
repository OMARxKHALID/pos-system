import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Query configuration
const menuQueryConfig = {
  staleTime: 30 * 60 * 1000, // 30 minutes
  gcTime: 60 * 60 * 1000, // 60 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

// Mutation handlers
const createMenuMutations = (queryClient) => ({
  addMenuItem: useMutation({
    mutationFn: (item) => apiClient.post("/menu", item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Menu item added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add menu item");
    },
  }),

  updateMenuItem: useMutation({
    mutationFn: ({ id, ...item }) => apiClient.putWithId("/menu", id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Menu item updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update menu item");
    },
  }),

  deleteMenuItem: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/menu", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      toast.success("Menu item deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete menu item");
    },
  }),
});

export function useMenu() {
  const queryClient = useQueryClient();

  // Fetch menu items
  const {
    data: menuItems,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => apiClient.get("/menu"),
    ...menuQueryConfig,
  });

  const mutations = createMenuMutations(queryClient);

  return {
    // Data
    menuItems,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    addMenuItem: mutations.addMenuItem.mutateAsync,
    updateMenuItem: mutations.updateMenuItem.mutateAsync,
    deleteMenuItem: mutations.deleteMenuItem.mutateAsync,

    // Mutation states
    isAdding: mutations.addMenuItem.isPending,
    isUpdating: mutations.updateMenuItem.isPending,
    isDeleting: mutations.deleteMenuItem.isPending,
  };
}
