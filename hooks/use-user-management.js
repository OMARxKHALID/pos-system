import { useUsers } from "@/hooks/use-users";
import { toast } from "sonner";

export function useUserManagement() {
  const {
    users,
    isLoading,
    isError,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  // Event handlers with toast notifications
  const handleAddUser = async (data) => {
    try {
      await addUser(data);
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleEditUser = async (data) => {
    try {
      await updateUser(data);
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

  const handleToggleUserStatus = async (userId, active) => {
    try {
      await toggleUserStatus({ id: userId, active });
      toast.success(
        `User ${active ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${active ? "activate" : "deactivate"} user`);
    }
  };

  return {
    users,
    isLoading,
    isError,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleToggleUserStatus,
  };
}
