"use client";

import { useEffect, useState } from "react";
import { Settings, ChevronRight, Home } from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { PaymentSettings } from "@/components/settings/payment-settings";
import { TaxSettings } from "@/components/settings/tax-settings";
import { CustomerSettings } from "@/components/settings/customer-settings";
import { ReceiptSettings } from "@/components/settings/receipt-settings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageLoading } from "@/components/ui/loading";

export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <PageLoading />;
  }

  return (
    <div className="flex-1 space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <Home className="w-3 h-3 sm:w-4 sm:h-4" />
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Admin</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="text-gray-900 font-medium">Settings</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
              <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Manage your system preferences and configurations
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
            System Active
          </Badge>
          <button
            onClick={toggleSidebar}
            className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm border border-gray-200"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Settings Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Payment Methods
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  3 Active
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Tax Configuration
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Enabled
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Customer Settings
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Configured
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Receipt Settings
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Active
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="payment"
            className="text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Payment
          </TabsTrigger>
          <TabsTrigger
            value="customer"
            className="text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Customer
          </TabsTrigger>
          <TabsTrigger
            value="receipt"
            className="text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Receipt
          </TabsTrigger>
          <TabsTrigger
            value="tax"
            className="text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
          >
            Tax
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="mt-6">
          <PaymentSettings />
        </TabsContent>

        <TabsContent value="customer" className="mt-6">
          <CustomerSettings />
        </TabsContent>

        <TabsContent value="receipt" className="mt-6">
          <ReceiptSettings />
        </TabsContent>

        <TabsContent value="tax" className="mt-6">
          <TaxSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
