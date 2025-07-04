import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get("/users"),
  });

  const addUser = useMutation({
    mutationFn: (user) => apiClient.post("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, ...user }) => apiClient.putWithId("/users", id, user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/users", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return {
    users,
    isLoading,
    isError,
    addUser: addUser.mutateAsync,
    updateUser: updateUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
  };
}
