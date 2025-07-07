import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

// Query configuration
const userManagementQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

// Mutation handlers
const createUserManagementMutations = (queryClient) => ({
  createUser: useMutation({
    mutationFn: (userData) => apiClient.post("/users", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  }),

  updateUser: useMutation({
    mutationFn: ({ id, ...userData }) =>
      apiClient.putWithId("/users", id, userData),
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

export function useUserManagement() {
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
    ...userManagementQueryConfig,
  });

  const mutations = createUserManagementMutations(queryClient);

  return {
    // Data
    users,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    createUser: mutations.createUser.mutateAsync,
    updateUser: mutations.updateUser.mutateAsync,
    deleteUser: mutations.deleteUser.mutateAsync,
    toggleUserStatus: mutations.toggleUserStatus.mutateAsync,

    // Mutation states
    isCreating: mutations.createUser.isPending,
    isUpdating: mutations.updateUser.isPending,
    isDeleting: mutations.deleteUser.isPending,
    isTogglingStatus: mutations.toggleUserStatus.isPending,
  };
}
