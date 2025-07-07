"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { PageLoading } from "@/components/ui/loading";
import {
  AlertTriangle,
  Shield,
  Users,
  Save,
  UserCheck,
  UserX,
  RotateCcw,
  Key,
} from "lucide-react";
import { capitalizeFirst } from "@/utils/string-utils";
import { getAvailablePermissions } from "@/utils/permission-utils";

export function AccessControlSettings() {
  const { users, isLoading, isError, updatePermissions, isUpdating } =
    useUserPermissions();

  const safeUsers = Array.isArray(users) ? users : [];
  const availablePermissions = getAvailablePermissions();

  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    if (user.role === "admin") {
      const allPermissions = {};
      availablePermissions.forEach((permission) => {
        allPermissions[permission.value] = true;
      });
      setUserPermissions(allPermissions);
    } else {
      setUserPermissions(
        user.permissions.reduce((acc, permission) => {
          acc[permission] = true;
          return acc;
        }, {})
      );
    }
  };

  const handlePermissionToggle = (permission) => {
    setUserPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const handleSavePermissions = () => {
    if (!selectedUser) return;

    const permissions = Object.keys(userPermissions).filter(
      (permission) => userPermissions[permission]
    );

    if (permissions.length === 0) {
      alert("At least one permission must be selected");
      return;
    }

    updatePermissions({
      userId: selectedUser._id,
      permissions,
    });
  };

  const getPermissionCount = (user) => {
    return user.permissions?.length || 0;
  };

  const getStatusColor = (user) => {
    if (user.role === "admin")
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (user.active !== false)
      return "bg-green-100 text-green-700 border-green-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load user permissions
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Selection */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            User Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {safeUsers.map((user, idx) => (
              <div
                key={user._id || user.email || idx}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  selectedUser?._id === user._id
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white/60"
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate text-sm">
                        {user.name}
                      </h3>
                      {user.role === "admin" && (
                        <Badge variant="default" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(user)}`}
                      >
                        {user.active !== false ? (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getPermissionCount(user)} perms
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Management */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            Permissions Management
            {selectedUser && (
              <Badge variant="outline" className="text-xs">
                {selectedUser.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {selectedUser ? (
            <>
              {selectedUser.role === "admin" && (
                <div className="p-3 sm:p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1 text-sm">
                        Administrator Account
                      </h4>
                      <p className="text-xs text-blue-700">
                        Admin users automatically have access to all pages and
                        their permissions cannot be modified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
                  Available Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.value}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        userPermissions[permission.value]
                          ? "border-purple-200 bg-purple-50/60"
                          : "border-gray-200 bg-white/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={permission.value}
                          checked={userPermissions[permission.value] || false}
                          onCheckedChange={() =>
                            handlePermissionToggle(permission.value)
                          }
                          disabled={selectedUser.role === "admin"}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={permission.value}
                            className="block font-medium text-gray-900 text-sm cursor-pointer"
                          >
                            {permission.label}
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUser.role !== "admin" && (
                <div className="flex justify-end pt-3">
                  <Button
                    onClick={handleSavePermissions}
                    disabled={isUpdating}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    {isUpdating ? "Saving..." : "Save Permissions"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Select a User
              </h3>
              <p className="text-xs text-gray-600">
                Choose a user from the list above to manage their permissions
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedUser(null);
            setUserPermissions({});
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset Selection
        </Button>
      </div>
    </div>
  );
}
