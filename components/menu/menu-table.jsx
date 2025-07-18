"use client";

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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategory } from "@/hooks/use-category";
import { Switch } from "@/components/ui/switch";
import { usePagination } from "@/hooks/use-pagination";
import TablePagination from "@/components/ui/table-pagination";
import { useEffect, useState } from "react";

const MenuTable = ({
  menuItems = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onUpdate,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const { categories } = useCategory();

  // Helper to get category name by id
  const getCategoryName = (category) => {
    if (category === "all") return "All Categories";

    // If category is a populated object, return its name
    if (typeof category === "object" && category !== null) {
      return category.name || "Unknown Category";
    }

    // If category is a string ID, find it in categories array
    const cat = categories?.find((c) => c._id === category);
    return cat ? cat.name : category;
  };

  // Filter menu items based on search, category filter, and status filter
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      (typeof item.category === "object" &&
        item.category?._id === categoryFilter) ||
      (typeof item.category === "string" && item.category === categoryFilter);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && item.available) ||
      (statusFilter === "unavailable" && !item.available);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    paginatedItems,
    totalPages,
    totalItems,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    resetPagination,
  } = usePagination(filteredItems, 10);

  // Reset pagination when search or filter changes
  useEffect(() => {
    resetPagination();
  }, [search, categoryFilter, statusFilter, resetPagination]);

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
      <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-4 lg:flex-row lg:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 lg:space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
          <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
            All Menu Items
          </CardTitle>
          <Badge variant="outline" className="text-xs ml-2">
            {filteredItems.length} of {menuItems?.length || 0} items
          </Badge>
        </div>
        <div className="flex flex-col items-start w-full gap-3 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
          <Input
            className="w-48 h-8 p-2 text-sm"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
        {isLoading ? (
          <div className="p-8 text-center">Loading menu items...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Failed to load menu items.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block -mx-4 overflow-x-auto sm:mx-0">
              <div className="min-w-[800px] px-4 sm:px-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="py-6 text-sm text-center text-gray-400 sm:py-8"
                        >
                          No menu items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item, index) => (
                        <TableRow key={item._id}>
                          <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                            {String(index + 1).padStart(3, "0")}
                          </TableCell>
                          <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                            {item.name}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-gray-600 sm:py-4 sm:text-sm max-w-[200px] truncate">
                            {item.description}
                          </TableCell>
                          <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                            ${parseFloat(item.price).toFixed(2)}
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(item.category)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.available}
                                onCheckedChange={async (checked) => {
                                  if (onUpdate) {
                                    await onUpdate({
                                      id: item._id,
                                      available: checked,
                                    });
                                  }
                                }}
                                aria-label={
                                  item.available
                                    ? "Set unavailable"
                                    : "Set available"
                                }
                              />
                              <Badge
                                variant={
                                  item.available ? "default" : "secondary"
                                }
                                className={`text-xs ${
                                  item.available
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }`}
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(item._id)}
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
              {paginatedItems.length === 0 ? (
                <div className="py-6 text-sm text-center text-gray-400 sm:py-8">
                  No menu items found
                </div>
              ) : (
                paginatedItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border p-3 bg-white flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.available}
                          onCheckedChange={async (checked) => {
                            if (onUpdate) {
                              await onUpdate({
                                id: item._id,
                                available: checked,
                              });
                            }
                          }}
                          aria-label={
                            item.available ? "Set unavailable" : "Set available"
                          }
                        />
                        <Badge
                          variant={item.available ? "default" : "secondary"}
                          className={`text-xs ${
                            item.available
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {item.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-900">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryName(item.category)}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="text-xs flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item._id)}
                        className="text-xs flex-1"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                totalItems={totalItems}
                itemsPerPage={10}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuTable;
