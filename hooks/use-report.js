import { useQuery } from "@tanstack/react-query";

export function useAnalytics() {
  return useQuery({
    queryKey: ["report"],
    queryFn: async () => {
      const res = await fetch("/api/report");
      return res.json();
    },
  });
}
