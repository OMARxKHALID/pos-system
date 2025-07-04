import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMenu() {
  const queryClient = useQueryClient();

  const {
    data: menuItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const addMenuItem = useMutation({
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

  const updateMenuItem = useMutation({
    mutationFn: async ({ id, ...item }) => {
      const res = await fetch(`/api/menu?id=${id}`, {
        method: "PUT",
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

  const deleteMenuItem = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
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
