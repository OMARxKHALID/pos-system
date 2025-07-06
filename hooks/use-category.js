import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  }),

  updateCategory: useMutation({
    mutationFn: ({ id, ...category }) =>
      apiClient.putWithId("/categories", id, category),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  }),

  deleteCategory: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/categories", id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
  }),
});

export function useCategory() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    isError,
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
    addCategory: mutations.addCategory.mutateAsync,
    updateCategory: mutations.updateCategory.mutateAsync,
    deleteCategory: mutations.deleteCategory.mutateAsync,
  };
}
