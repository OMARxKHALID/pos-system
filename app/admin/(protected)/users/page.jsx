"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users";
import { useSession } from "next-auth/react";
import { useAdminSidebarStore } from "@/hooks/use-pos-settings-store";
import { useRef } from "react";
import { Plus, Users, Menu } from "lucide-react";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const { data: users, isLoading, isError } = useUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  function openAdd() {
    setForm({ name: "", email: "", password: "", role: "staff" });
    setEditId(null);
    setShowDialog(true);
  }

  function openEdit(user) {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditId(user._id);
    setShowDialog(true);
  }

  async function handleDelete(id) {
    try {
      await deleteUser.mutateAsync(id);
      toast.success("User deleted!");
    } catch (e) {
      toast.error("Delete failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser.mutateAsync({ id: editId, ...form });
        toast.success("User updated!");
      } else {
        await addUser.mutateAsync(form);
        toast.success("User added!");
      }
      setShowDialog(false);
    } catch (e) {
      toast.error("Save failed");
    }
  }

  // Filter users based on search and role filter
  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (status === "loading")
    return <div className="p-8 text-center">Loading session...</div>;
  if (!isAdmin)
    return (
      <div className="p-8 text-center text-red-500">
        Access denied. Admins only.
      </div>
    );

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <Card className="border border-gray-200 bg-white shadow-sm sm:rounded-xl">
          <CardHeader className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 p-2 hover:bg-gray-100 sm:p-2"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                  User Management
                </CardTitle>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Button
                className="flex w-full items-center gap-2 sm:w-auto"
                onClick={openAdd}
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
              <div className="flex w-full items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:w-auto sm:px-4">
                <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="truncate text-xs sm:text-sm font-medium text-gray-700 max-w-[40vw] sm:max-w-none">
                  {filteredUsers.length} Users
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Users Table */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-4 lg:flex-row lg:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 lg:space-y-0">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
              <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                All Users
              </CardTitle>
            </div>
            <div className="flex flex-col items-start w-full gap-3 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
              <Input
                className="w-48 h-8 p-2 text-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
            {isLoading ? (
              <div className="p-8 text-center">Loading users...</div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">
                Failed to load users.
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block -mx-4 overflow-x-auto sm:mx-0">
                  <div className="min-w-[700px] px-4 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="py-6 text-sm text-center text-gray-400 sm:py-8"
                            >
                              No users found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                                {user.name}
                              </TableCell>
                              <TableCell className="py-3 text-xs text-gray-600 sm:py-4 sm:text-sm">
                                {user.email}
                              </TableCell>
                              <TableCell className="py-3 sm:py-4">
                                <Badge
                                  variant={
                                    user.role === "admin"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-3 sm:py-4 flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEdit(user)}
                                  className="text-xs"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete(user._id)}
                                  className="text-xs"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Mobile Card/List */}
                <div className="md:hidden space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="py-6 text-sm text-center text-gray-400 sm:py-8">
                      No users found
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="rounded-lg border p-3 bg-white flex flex-col gap-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-900">
                            {user.name}
                          </span>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          {user.email}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(user)}
                            className="text-xs flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user._id)}
                            className="text-xs flex-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required={!editId}
            />
            <Select
              value={form.role}
              onValueChange={(value) => setForm((f) => ({ ...f, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editId ? "Update" : "Add"} User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
