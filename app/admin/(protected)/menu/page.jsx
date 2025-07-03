"use client";

import { useMenu, useAddMenuItem } from "@/hooks/use-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAdminSidebarStore } from "@/hooks/use-pos-settings-store";
import { useRef } from "react";
import { Plus, Menu as MenuIcon, Utensils, Search } from "lucide-react";

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
        step="0.01"
        value={form.price}
        onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        required
      />
      <Select
        value={form.category}
        onValueChange={(value) => setForm((f) => ({ ...f, category: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="appetizers">Appetizers</SelectItem>
          <SelectItem value="main-courses">Main Courses</SelectItem>
          <SelectItem value="desserts">Desserts</SelectItem>
          <SelectItem value="beverages">Beverages</SelectItem>
          <SelectItem value="sides">Sides</SelectItem>
        </SelectContent>
      </Select>
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
      <DialogFooter>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
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
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);
  const linkRef = useRef(null);

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

  // Filter menu items based on search and category filter
  const filteredMenu = (data || []).filter((item) => {
    const matchesSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
                <MenuIcon className="h-6 w-6 text-gray-600" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                  Menu Management
                </CardTitle>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Button
                className="flex w-full items-center gap-2 sm:w-auto"
                onClick={() => {
                  setShowForm(true);
                  setEditItem(null);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Menu Item</span>
              </Button>
              <div className="flex w-full items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 sm:w-auto sm:px-4">
                <Utensils className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="truncate text-xs sm:text-sm font-medium text-gray-700 max-w-[40vw] sm:max-w-none">
                  {filteredMenu.length} Items
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
          <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-4 lg:flex-row lg:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 lg:space-y-0">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
              <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
                All Menu Items
              </CardTitle>
            </div>
            <div className="flex flex-col items-start w-full gap-3 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
              <Input
                className="w-48 h-8 p-2 text-sm"
                placeholder="Search menu items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="appetizers">Appetizers</SelectItem>
                  <SelectItem value="main-courses">Main Courses</SelectItem>
                  <SelectItem value="desserts">Desserts</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="sides">Sides</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
            {isLoading ? (
              <div className="p-8 text-center">Loading menu...</div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">
                Failed to load menu.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.length === 0 ? (
                  <div className="col-span-full py-6 text-sm text-center text-gray-400 sm:py-8">
                    No menu items found
                  </div>
                ) : (
                  filteredMenu.map((item) => (
                    <Card
                      key={item._id}
                      className="flex flex-col justify-between p-4 h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {item.icon && (
                          <span className="text-2xl flex-shrink-0">
                            {item.icon}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            ${parseFloat(item.price).toFixed(2)}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="text-xs flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          className="text-xs flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Menu Item Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, id: null })}
      >
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this menu item? This action cannot
              be undone.
            </p>
          </div>
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
