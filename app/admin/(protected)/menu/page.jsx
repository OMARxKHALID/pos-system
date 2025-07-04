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
import { useMenu } from "@/hooks/use-menu";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import MenuForm from "@/components/menu/menu-form";
import MenuTable from "@/components/menu/menu-table";
import AdminMenuHeader from "@/components/menu/menu-header";

export default function MenuPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  const {
    menuItems,
    isLoading,
    isError,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useMenu();

  const handleAddItem = async (data) => {
    try {
      await addMenuItem(data);
      setIsAddDialogOpen(false);
      toast.success("Menu item added successfully");
    } catch (error) {
      toast.error("Failed to add menu item");
    }
  };

  const handleEditItem = async (data) => {
    try {
      await updateMenuItem({ id: editingItem._id, ...data });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success("Menu item updated successfully");
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteMenuItem(itemId);
      toast.success("Menu item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading menu items...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load menu items.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <AdminMenuHeader
          toggleSidebar={toggleSidebar}
          data={menuItems}
          linkRef={linkRef}
          onAdd={() => setIsAddDialogOpen(true)}
        />

        {/* Menu Table */}
        <MenuTable
          menuItems={menuItems}
          isLoading={isLoading}
          isError={isError}
          onEdit={openEditDialog}
          onDelete={handleDeleteItem}
          onUpdate={updateMenuItem}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        {/* Edit Menu Item Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <MenuForm onSubmit={handleEditItem} initialData={editingItem} />
          </DialogContent>
        </Dialog>
        {/* Add Menu Item Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            {/* This trigger is now hidden, as the button is in the header */}
            <span style={{ display: "none" }} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <MenuForm onSubmit={handleAddItem} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
