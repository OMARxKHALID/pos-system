"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { useUserManagement } from "@/hooks/use-user-management";
import { UserManagementHeader } from "@/components/user/user-management-header";
import { UserStatsCards } from "@/components/user/user-stats-cards";
import UserTable from "@/components/user/user-table";
import { UserDialogs } from "@/components/user/user-dialogs";
import { PageLoading } from "@/components/ui/loading";
import { AlertTriangle } from "lucide-react";
import {
  calculateUserStats,
  filterUsers,
  filterOutCurrentUser,
} from "@/utils/user-utils";

export default function UsersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);

  const { data: session } = useSession();
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);
  const {
    users,
    isLoading,
    isError,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleUserStatus,
  } = useUserManagement();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter out current user using utility function
  const filteredUsers = filterOutCurrentUser(users, session?.user);

  // Apply search and role filters
  const displayUsers = filterUsers(filteredUsers, search, roleFilter);

  // Calculate statistics
  const userStats = calculateUserStats(filteredUsers);

  // Enhanced handlers with dialog management
  const onAddUser = async (data) => {
    await handleAddUser(data);
    setIsAddDialogOpen(false);
  };

  const onEditUser = async (data) => {
    await handleEditUser({ id: editingUser._id, ...data });
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => setIsAddDialogOpen(false);
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  if (!isClient) {
    return <PageLoading />;
  }

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load users
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      <UserManagementHeader
        totalUsers={userStats.total}
        onAddUser={() => setIsAddDialogOpen(true)}
        onToggleSidebar={toggleSidebar}
      />

      <UserStatsCards stats={userStats} />

      <UserTable
        users={displayUsers}
        isLoading={isLoading}
        isError={isError}
        onEdit={openEditDialog}
        onDelete={handleDeleteUser}
        onToggleStatus={handleToggleUserStatus}
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />

      <UserDialogs
        isAddOpen={isAddDialogOpen}
        isEditOpen={isEditDialogOpen}
        editingUser={editingUser}
        onAddClose={closeAddDialog}
        onEditClose={closeEditDialog}
        onAddUser={onAddUser}
        onEditUser={onEditUser}
      />
    </div>
  );
}
