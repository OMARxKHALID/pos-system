import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { getAvailablePermissions } from "@/utils/permission-utils";

// Default query configuration
const defaultUsersQueryConfig = {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
};

export function useUsers(queryConfig = {}) {
  const queryClient = useQueryClient();

  // === Queries ===
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await apiClient.get("/users/permissions");
      return Array.isArray(result?.users) ? result.users : [];
    },
    ...defaultUsersQueryConfig,
    ...queryConfig,
  });

  // === Mutations ===
  const createUser = useMutation({
    mutationFn: (userData) => apiClient.post("/users", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, ...userData }) =>
      apiClient.putWithId("/users", id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id) => apiClient.deleteWithId("/users", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: ({ id, active }) =>
      apiClient.putWithId("/users", id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });

  const updatePermissions = useMutation({
    mutationFn: ({ userId, permissions }) =>
      apiClient.put("/users/permissions", { userId, permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User permissions updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  // === Available Permissions ===
  const availablePermissions = getAvailablePermissions();

  // === Return ===
  return {
    users,
    availablePermissions,
    isLoading,
    isError,
    error,

    // Actions
    createUser: createUser.mutateAsync,
    updateUser: updateUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
    toggleUserStatus: toggleUserStatus.mutateAsync,
    updatePermissions: updatePermissions.mutate,

    // States
    isCreating: createUser.isPending,
    isUpdating: updateUser.isPending,
    isDeleting: deleteUser.isPending,
    isTogglingStatus: toggleUserStatus.isPending,
    isUpdatingPermissions: updatePermissions.isPending,
  };
}
