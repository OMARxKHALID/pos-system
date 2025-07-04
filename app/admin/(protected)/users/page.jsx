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
import { useAdminSidebarStore } from "@/hooks/zustand/use-pos-settings-store";
import UserForm from "@/components/user/user-form";
import UserTable from "@/components/user/user-table";
import AdminUsersHeader from "@/components/user/users-header";

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
    return <div className="p-8 text-center">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load users.</div>
    );
  }

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <AdminUsersHeader
          toggleSidebar={toggleSidebar}
          data={users}
          linkRef={linkRef}
          onAdd={() => setIsAddDialogOpen(true)}
        />

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
