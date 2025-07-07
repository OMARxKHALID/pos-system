"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  hasPermission,
  canAccessPath,
  getRequiredPermission,
  getAvailablePermissions,
} from "@/utils/permission-utils";

// Query configuration
const userPermissionsQueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: true,
  refetchOnReconnect: true,
};

// Permission checking hook for current user
export function useUserPermissionCheck() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const userRole = user?.role;
  const userPermissions = user?.permissions || [];

  const hasUserPermission = (permission) => {
    if (status === "loading") return false;
    if (!user) return false;
    return hasPermission(user, permission);
  };

  const canUserAccessPath = (path) => {
    if (status === "loading") return false;
    if (!user) return false;
    return canAccessPath(user, path);
  };

  const getPathRequiredPermission = (path) => {
    return getRequiredPermission(path);
  };

  const isAdmin = () => {
    if (status === "loading") return false;
    return userRole === "admin";
  };

  const isStaff = () => {
    if (status === "loading") return false;
    return userRole === "staff";
  };

  const hasAnyPermission = (permissions) => {
    if (status === "loading") return false;
    if (!user) return false;
    if (isAdmin()) return true;
    return permissions.some((permission) =>
      userPermissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions) => {
    if (status === "loading") return false;
    if (!user) return false;
    if (isAdmin()) return true;
    return permissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };

  return {
    // User data
    user,
    userRole,
    userPermissions,
    isLoading: status === "loading",
    isAuthenticated: !!user,

    // Permission checking
    hasUserPermission,
    canUserAccessPath,
    getPathRequiredPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Role checking
    isAdmin,
    isStaff,
  };
}

// User permissions management hook for admin functionality
export function useUserPermissions() {
  const queryClient = useQueryClient();

  // Fetch all users with their permissions
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-permissions"],
    queryFn: async () => {
      const result = await apiClient.get("/users/permissions");
      return result;
    },
    ...userPermissionsQueryConfig,
  });

  const users = Array.isArray(data?.users) ? data.users : [];

  // Update user permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ userId, permissions }) => {
      const result = await apiClient.put("/users/permissions", {
        userId,
        permissions,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User permissions updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  // Get available permissions
  const availablePermissions = getAvailablePermissions();

  return {
    // Data
    users,
    availablePermissions,

    // Loading states
    isLoading,
    isError,
    error,

    // Actions
    updatePermissions: updatePermissionsMutation.mutate,
    isUpdating: updatePermissionsMutation.isPending,
  };
}
