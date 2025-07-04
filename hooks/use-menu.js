import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useMenu() {
  const queryClient = useQueryClient();

  const {
    data: menuItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => apiClient.get("/menu"),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const addMenuItem = useMutation({
    mutationFn: (item) => apiClient.post("/menu", item),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu"]);
    },
  });

  const updateMenuItem = useMutation({
    mutationFn: ({ id, ...item }) => apiClient.putWithId("/menu", id, item),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu"]);
    },
  });

  const deleteMenuItem = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/menu", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu"]);
    },
  });

  return {
    menuItems,
    isLoading,
    isError,
    addMenuItem: addMenuItem.mutateAsync,
    updateMenuItem: updateMenuItem.mutateAsync,
    deleteMenuItem: deleteMenuItem.mutateAsync,
  };
}

export function useAddMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item) => {
      const res = await fetch("/api/menu", {
        method: "POST",
        body: JSON.stringify(item),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["menu"]);
    },
  });
}
