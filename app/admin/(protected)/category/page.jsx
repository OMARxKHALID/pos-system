"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCategory } from "@/hooks/use-category";
import CategoryHeader from "@/components/category/category-header";
import CategoryTable from "@/components/category/category-table";
import CategoryForm from "@/components/category/category-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";

export default function CategoryPage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const {
    categories,
    isLoading,
    isError,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategory();
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data);
      setIsAddDialogOpen(false);
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleEditCategory = async (data) => {
    try {
      await updateCategory({ id: editingCategory._id, ...data });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const openEditDialog = (cat) => {
    setEditingCategory(cat);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        <CategoryHeader
          onAdd={() => setIsAddDialogOpen(true)}
          count={categories?.length}
          toggleSidebar={toggleSidebar}
        />

        <CategoryTable
          categories={categories}
          onEdit={openEditDialog}
          onDelete={handleDeleteCategory}
        />

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={handleEditCategory}
              initialData={editingCategory}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSubmit={handleAddCategory} initialData={null} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
