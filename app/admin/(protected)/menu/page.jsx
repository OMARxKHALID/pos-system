"use client";

import { useState, useRef, useEffect } from "react";
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
import { Package, ChevronRight, Home, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLoading } from "@/components/ui/loading";
import { PermissionGuard } from "@/components/common/permission-guard";

export default function MenuPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return <PageLoading />;
  }

  return (
    <PermissionGuard requiredPermission="menu">
      {isLoading ? (
        <PageLoading />
      ) : isError ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 text-red-500 text-base sm:text-lg font-medium">
              Failed to load menu items.
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
            <span className="text-gray-900 font-medium">Menu</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <Package className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Menu Management
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                    Manage your restaurant menu items and categories
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
              >
                <Package className="w-3 h-3 mr-1.5 sm:mr-2" />
                {menuItems?.length || 0} Items
              </Badge>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Add Item
              </Button>
              <button
                onClick={toggleSidebar}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Total Items
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {menuItems?.length || 0}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-blue-100 rounded-lg">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Available Items
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {menuItems?.filter((item) => item.available)?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {menuItems?.length > 0
                        ? `${Math.round(
                            (menuItems.filter((item) => item.available).length /
                              menuItems.length) *
                              100
                          )}% of total`
                        : "0% of total"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-green-100 rounded-lg">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Categories
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      {
                        new Set(menuItems?.map((item) => item.category) || [])
                          .size
                      }
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-purple-100 rounded-lg">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                      Average Price
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                      $
                      {menuItems?.length > 0
                        ? (
                            menuItems.reduce(
                              (sum, item) => sum + item.price,
                              0
                            ) / menuItems.length
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-orange-100 rounded-lg">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <MenuTable
            menuItems={menuItems}
            isLoading={isLoading}
            isError={isError}
            onEdit={openEditDialog}
            onDelete={handleDeleteItem}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />

          {/* Add Menu Item Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <MenuForm
                onSubmit={handleAddItem}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Edit Menu Item Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Menu Item</DialogTitle>
              </DialogHeader>
              <MenuForm
                initialData={editingItem}
                onSubmit={handleEditItem}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingItem(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </PermissionGuard>
  );
}
