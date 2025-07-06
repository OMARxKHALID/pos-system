import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Home, Plus, Crown } from "lucide-react";

export function UserManagementHeader({
  totalUsers,
  onAddUser,
  onToggleSidebar,
}) {
  return (
    <>
      <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Admin</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-gray-900 font-medium">Users</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg sm:rounded-xl">
              <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Manage restaurant staff and user accounts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="secondary"
            className="bg-indigo-100 text-indigo-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
          >
            <Crown className="w-3 h-3 mr-1.5 sm:mr-2" />
            {totalUsers} Users
          </Badge>
          <Button
            onClick={onAddUser}
            className="bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Add User
          </Button>
          <button
            onClick={onToggleSidebar}
            className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
          >
            <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
