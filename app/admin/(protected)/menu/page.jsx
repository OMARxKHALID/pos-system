"use client";

import { useMenu, useAddMenuItem } from "@/hooks/use-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

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
      className="space-y-2"
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
      <Button type="submit" disabled={loading}>
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

  async function handleEdit(item) {
    setEditItem(item);
    setShowForm(true);
  }

  async function handleDelete(id) {
    setFormLoading(true);
    try {
      const res = await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Menu item deleted!");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
    setFormLoading(false);
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
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Menu Management</h1>
      <Button
        onClick={() => {
          setShowForm(true);
          setEditItem(null);
        }}
        className="mb-4"
      >
        Add Menu Item
      </Button>
      {showForm && (
        <Card className="mb-4 p-4">
          <MenuForm
            onSubmit={handleSubmit}
            initial={editItem || {}}
            loading={formLoading}
          />
        </Card>
      )}
      {isLoading ? (
        <div>Loading menu...</div>
      ) : isError ? (
        <div className="text-red-500">Failed to load menu.</div>
      ) : (
        <div className="space-y-4">
          {data &&
            data.map((item) => (
              <Card
                key={item._id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.category} - ${item.price}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(item)}>
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
    </div>
  );
}
