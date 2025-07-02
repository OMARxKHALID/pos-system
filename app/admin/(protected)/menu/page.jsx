"use client";

import { useMenu, useAddMenuItem } from "@/hooks/use-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function MenuForm({ onSubmit, initial = {}, loading }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    price: initial.price || "",
    category: initial.category || "",
    description: initial.description || "",
    image: initial.image || "",
    icon: initial.icon || "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
      />
      <Input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        required
      />
      <Input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        required
      />
      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm((f) => ({ ...f, description: e.target.value }))
        }
      />
      <Input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
      />
      <Input
        placeholder="Icon (optional, emoji or text)"
        value={form.icon}
        onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

export default function AdminMenuPage() {
  const { data, isLoading, isError, refetch } = useMenu();
  const addMenu = useAddMenuItem();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  async function handleEdit(item) {
    setEditItem(item);
    setShowForm(true);
  }

  async function handleDelete(id) {
    setDeleteDialog({ open: true, id });
  }

  async function confirmDelete() {
    setFormLoading(true);
    try {
      const res = await fetch(`/api/menu?id=${deleteDialog.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Menu item deleted!");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
    setFormLoading(false);
    setDeleteDialog({ open: false, id: null });
  }

  async function handleSubmit(form) {
    setFormLoading(true);
    try {
      if (editItem) {
        const res = await fetch(`/api/menu?id=${editItem._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Update failed");
        toast.success("Menu item updated!");
      } else {
        await addMenu.mutateAsync(form);
        toast.success("Menu item added!");
      }
      setShowForm(false);
      setEditItem(null);
      refetch();
    } catch {
      toast.error("Save failed");
    }
    setFormLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        Admin Menu Management
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <Button
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
          }}
          className="w-full sm:w-auto"
        >
          Add Menu Item
        </Button>
      </div>
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>
                {editItem ? "Edit Menu Item" : "Add Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <MenuForm
              onSubmit={handleSubmit}
              initial={editItem || {}}
              loading={formLoading}
            />
          </DialogContent>
        </Dialog>
      )}
      {isLoading ? (
        <div className="p-8 text-center">Loading menu...</div>
      ) : isError ? (
        <div className="p-8 text-center text-red-500">Failed to load menu.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data &&
            data.map((item) => (
              <Card
                key={item._id}
                className="flex flex-col justify-between p-4 h-full"
              >
                <div className="flex items-center gap-3 mb-2">
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                  <div>
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category} - ${item.price}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditItem(item);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(item._id)}
                    disabled={formLoading}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({ open, id: open ? deleteDialog.id : null })
        }
      >
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this menu item?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: null })}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={formLoading}
            >
              {formLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
