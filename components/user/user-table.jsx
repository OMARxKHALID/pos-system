"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import TablePagination from "@/components/ui/table-pagination";
import { capitalizeFirst } from "@/utils/string-utils";
import { filterUsers } from "@/utils/user-utils";
import { getPermissionDisplayName } from "@/utils/permission-utils";

const UserTable = ({
  users = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onToggleStatus,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
}) => {
  // Filter users based on search and role filter
  const filteredUsers = filterUsers(users, search, roleFilter);

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
  } = usePagination(filteredUsers, 10);

  // Reset pagination when search or filter changes
  useEffect(() => {
    resetPagination();
  }, [search, roleFilter, resetPagination]);

  return (
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
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
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
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((user, index) => (
                        <TableRow key={user._id}>
                          <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                            {String(index + 1).padStart(3, "0")}
                          </TableCell>
                          <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                            {user.name}
                          </TableCell>
                          <TableCell className="py-3 text-xs text-gray-600 sm:py-4 sm:text-sm">
                            {user.email}
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {capitalizeFirst(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <div className="flex flex-wrap gap-1">
                              {user.role === "admin" ? (
                                <Badge variant="outline" className="text-xs">
                                  All Access
                                </Badge>
                              ) : (
                                user.permissions?.map((permission) => (
                                  <Badge
                                    key={permission}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {getPermissionDisplayName(permission)}
                                  </Badge>
                                )) || (
                                  <span className="text-xs text-gray-400">
                                    No permissions
                                  </span>
                                )
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.active !== false}
                                onCheckedChange={(checked) =>
                                  onToggleStatus(user._id, checked)
                                }
                              />
                              <Badge
                                variant={
                                  user.active !== false
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {user.active !== false ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 sm:py-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(user)}
                              className="text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onDelete(user._id)}
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
                  No users found
                </div>
              ) : (
                paginatedItems.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-lg border p-3 bg-white flex flex-col gap-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-900">
                        {user.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {capitalizeFirst(user.role)}
                        </Badge>
                        <Badge
                          variant={
                            user.active !== false ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {user.active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Permissions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {user.role === "admin" ? (
                          <Badge variant="outline" className="text-xs">
                            All Access
                          </Badge>
                        ) : (
                          user.permissions?.map((permission) => (
                            <Badge
                              key={permission}
                              variant="outline"
                              className="text-xs"
                            >
                              {getPermissionDisplayName(permission)}
                            </Badge>
                          )) || (
                            <span className="text-xs text-gray-400">
                              No permissions
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <Switch
                        checked={user.active !== false}
                        onCheckedChange={(checked) =>
                          onToggleStatus(user._id, checked)
                        }
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(user)}
                        className="text-xs flex-1"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(user._id)}
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

export default UserTable;
