"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCategory } from "@/hooks/use-category";
import CategoryTable from "@/components/category/category-table";
import CategoryForm from "@/components/category/category-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { Tag, ChevronRight, Home, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";
import { PermissionGuard } from "@/components/common/permission-guard";

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

  return (
    <PermissionGuard requiredPermission="category">
      {isLoading ? (
        <PageLoading />
      ) : isError ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 text-red-500 text-base sm:text-lg font-medium">
              Failed to load categories.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Admin</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-gray-900 font-medium">Categories</span>
          </nav>

          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                  <Tag className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Category Management
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Organize your menu with categories and tags
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <Tag className="w-3 h-3 mr-1.5 sm:mr-2" />
                {categories?.length || 0} Categories
              </Badge>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Add Category
              </Button>
              <button
                onClick={toggleSidebar}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
              >
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Categories
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {categories?.length || 0}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Active Categories
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {categories?.filter((cat) => cat.isActive !== false)
                        ?.length || 0}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Featured Categories
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {categories?.filter((cat) => cat.isFeatured)?.length || 0}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
                    <Tag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Table */}
          <CategoryTable
            categories={categories}
            onEdit={openEditDialog}
            onDelete={handleDeleteCategory}
          />

          {/* Add Category Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                initialData={editingCategory}
                onSubmit={handleEditCategory}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </PermissionGuard>
  );
}
