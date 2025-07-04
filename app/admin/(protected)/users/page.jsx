"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUsers } from "@/hooks/use-users";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import UserForm from "@/components/user/user-form";
import UserTable from "@/components/user/user-table";
import {
  Users,
  ChevronRight,
  Home,
  Plus,
  Shield,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  const { users, isLoading, isError, addUser, updateUser, deleteUser } =
    useUsers();

  const handleAddUser = async (data) => {
    try {
      await addUser(data);
      setIsAddDialogOpen(false);
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleEditUser = async (data) => {
    try {
      await updateUser({ id: editingUser._id, ...data });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-gray-600 text-base sm:text-lg font-medium">
            Loading users...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 text-red-500 text-base sm:text-lg font-medium">
            Failed to load users.
          </div>
        </div>
      </div>
    );
  }

  // Calculate user statistics
  const totalUsers = users?.length || 0;
  const adminUsers =
    users?.filter((user) => user.role === "admin")?.length || 0;
  const staffUsers =
    users?.filter((user) => user.role === "staff")?.length || 0;
  const activeUsers =
    users?.filter((user) => user.isActive !== false)?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-gray-900 font-medium">Users</span>
          </nav>

          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg sm:rounded-xl">
                  <Users className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Manage restaurant staff and user accounts
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <Users className="w-3 h-3 mr-1.5 sm:mr-2" />
                {totalUsers} Users
              </Badge>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Add User
              </Button>
              <button
                ref={linkRef}
                onClick={toggleSidebar}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Users
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {totalUsers}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-indigo-100 rounded-lg">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Admins
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {adminUsers}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-red-100 rounded-lg">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Staff
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {staffUsers}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Active Users
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {activeUsers}
                  </p>
                </div>
                <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                  <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <UserTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          onEdit={openEditDialog}
          onDelete={handleDeleteUser}
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleEditUser} initialData={editingUser} />
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            {/* This trigger is now hidden, as the button is in the header */}
            <span style={{ display: "none" }} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAddUser} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
