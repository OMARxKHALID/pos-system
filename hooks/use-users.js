import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

const usersQueryConfig = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

const createUserMutations = (queryClient) => ({
  addUser: useMutation({
    mutationFn: (user) => apiClient.post("/users", user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  }),

  updateUser: useMutation({
    mutationFn: ({ id, ...user }) => apiClient.putWithId("/users", id, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  }),

  deleteUser: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/users", id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  }),

  toggleUserStatus: useMutation({
    mutationFn: ({ id, active }) =>
      apiClient.putWithId("/users", id, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  }),
});

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await apiClient.get("/users");
      return result;
    },
    ...usersQueryConfig,
  });

  const mutations = createUserMutations(queryClient);

  return {
    users,
    isLoading,
    isError,
    addUser: mutations.addUser.mutateAsync,
    updateUser: mutations.updateUser.mutateAsync,
    deleteUser: mutations.deleteUser.mutateAsync,
    toggleUserStatus: mutations.toggleUserStatus.mutateAsync,
  };
}
