"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { toast } from "sonner";
import {
  useUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-users";
import { useSession } from "next-auth/react";

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
  if (status === "loading")
    return <div className="p-8 text-center">Loading session...</div>;
  if (!isAdmin)
    return (
      <div className="p-8 text-center text-red-500">
        Access denied. Admins only.
      </div>
    );
  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        User Management
      </h1>
      <Button className="mb-4 w-full sm:w-auto" onClick={openAdd}>
        Add User
      </Button>
      <Card className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">Loading users...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Failed to load users.
          </div>
        ) : (
          <div className="min-w-[600px] w-full">
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-400 py-8"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleDelete(user._id)}
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
        )}
      </Card>
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
            <select
              className="w-full border rounded p-2"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editId ? "Save" : "Add"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
