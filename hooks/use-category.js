import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

const categoryQueryConfig = {
  staleTime: 30 * 60 * 1000,
  gcTime: 60 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

const createCategoryMutations = (queryClient) => ({
  addCategory: useMutation({
    mutationFn: (category) => apiClient.post("/categories", category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category added successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add category");
    },
  }),

  updateCategory: useMutation({
    mutationFn: ({ id, ...category }) =>
      apiClient.putWithId("/categories", id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  }),

  deleteCategory: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/categories", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  }),
});

export function useCategory() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get("/categories"),
    ...categoryQueryConfig,
  });

  const mutations = createCategoryMutations(queryClient);

  return {
    categories,
    isLoading,
    isError,
    error,
    addCategory: mutations.addCategory.mutateAsync,
    updateCategory: mutations.updateCategory.mutateAsync,
    deleteCategory: mutations.deleteCategory.mutateAsync,
    isAdding: mutations.addCategory.isPending,
    isUpdating: mutations.updateCategory.isPending,
    isDeleting: mutations.deleteCategory.isPending,
  };
}
