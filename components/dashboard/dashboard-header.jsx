"use client";

import { BarChart3, ChevronRight, Home, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardHeader({ toggleSidebar, onRefresh, isRefreshing }) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Admin</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-gray-900 font-medium">Dashboard</span>
      </nav>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
              <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Overview of your restaurant performance and dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 text-xs sm:text-sm px-2 sm:px-3 py-1"
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></div>
            Live Data
          </Badge>
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <button
            onClick={toggleSidebar}
            className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
