import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Query configuration
const usersQueryConfig = {
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

// Mutation handlers
const createUserMutations = (queryClient) => ({
  addUser: useMutation({
    mutationFn: (user) => apiClient.post("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  }),

  updateUser: useMutation({
    mutationFn: ({ id, ...user }) => apiClient.putWithId("/users", id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  }),

  deleteUser: useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/users", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  }),

  toggleUserStatus: useMutation({
    mutationFn: ({ id, active }) =>
      apiClient.putWithId("/users", id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status");
    },
  }),
});

export function useUsers() {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get("/users"),
    ...usersQueryConfig,
  });

  const mutations = createUserMutations(queryClient);

  return {
    // Data
    users,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    addUser: mutations.addUser.mutateAsync,
    updateUser: mutations.updateUser.mutateAsync,
    deleteUser: mutations.deleteUser.mutateAsync,
    toggleUserStatus: mutations.toggleUserStatus.mutateAsync,

    // Mutation states
    isCreating: mutations.addUser.isPending,
    isUpdating: mutations.updateUser.isPending,
    isDeleting: mutations.deleteUser.isPending,
    isTogglingStatus: mutations.toggleUserStatus.isPending,
  };
}
