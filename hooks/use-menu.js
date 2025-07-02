import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMenu() {
  return useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await fetch("/api/menu");
      return res.json();
    },
  });
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
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["menu"]);
    },
  });
}
