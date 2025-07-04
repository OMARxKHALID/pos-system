import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useCategory() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get("/categories"),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const addCategory = useMutation({
    mutationFn: (category) => apiClient.post("/categories", category),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, ...category }) =>
      apiClient.putWithId("/categories", id, category),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/categories", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  return {
    categories,
    isLoading,
    isError,
    addCategory: addCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
  };
}
