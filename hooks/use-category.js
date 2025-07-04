import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCategory() {
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const addCategory = useMutation({
    mutationFn: async (category) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...category }) => {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: "PUT",
        body: JSON.stringify(category),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
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
