"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  ChevronRight,
  Home,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  CreditCard,
  Users,
  Receipt,
  Calculator,
  Shield,
} from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { PaymentSettings } from "@/components/settings/payment-settings";
import { TaxSettings } from "@/components/settings/tax-settings";
import { CustomerSettings } from "@/components/settings/customer-settings";
import { ReceiptSettings } from "@/components/settings/receipt-settings";
import { AccessControlSettings } from "@/components/settings/access-control-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageLoading } from "@/components/ui/loading";
import { PermissionGuard } from "@/components/common/permission-guard";

export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false);
  const [openSections, setOpenSections] = useState({
    payment: true,
    customer: false,
    receipt: false,
    tax: false,
    access: false,
  });
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const settingsSections = [
    {
      id: "payment",
      title: "Payment Settings",
      description: "Configure payment methods and preferences",
      icon: CreditCard,
      color: "blue",
      component: PaymentSettings,
    },
    {
      id: "customer",
      title: "Customer Settings",
      description: "Manage customer information and preferences",
      icon: Users,
      color: "green",
      component: CustomerSettings,
    },
    {
      id: "receipt",
      title: "Receipt Settings",
      description: "Customize receipt templates and printing",
      icon: Receipt,
      color: "purple",
      component: ReceiptSettings,
    },
    {
      id: "tax",
      title: "Tax Settings",
      description: "Configure tax rates and calculations",
      icon: Calculator,
      color: "red",
      component: TaxSettings,
    },
    {
      id: "access",
      title: "Access Control",
      description: "Manage user permissions and access levels",
      icon: Shield,
      color: "orange",
      component: AccessControlSettings,
    },
  ];

  if (!isClient) {
    return <PageLoading />;
  }

  return (
    <PermissionGuard requiredPermission="settings">
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

        {/* Settings Sections */}
        <div className="space-y-4">
          {settingsSections.map((section) => {
            const SectionComponent = section.component;
            const SectionIcon = section.icon;
            const isOpen = openSections[section.id];
            const colorClasses = {
              blue: "from-blue-50/50 to-indigo-50/50 border-blue-200",
              green: "from-green-50/50 to-emerald-50/50 border-green-200",
              purple: "from-purple-50/50 to-violet-50/50 border-purple-200",
              red: "from-red-50/50 to-orange-50/50 border-red-200",
              orange: "from-orange-50/50 to-amber-50/50 border-orange-200",
            };

            return (
              <Collapsible
                key={section.id}
                open={isOpen}
                onOpenChange={() => toggleSection(section.id)}
              >
                <Card
                  className={`border-0 shadow-sm bg-gradient-to-r ${
                    colorClasses[section.color]
                  }`}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-3 sm:pb-4 cursor-pointer hover:bg-white/20 transition-colors duration-200">
                      <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`p-1.5 sm:p-2 bg-${section.color}-100 rounded-lg`}
                          >
                            <SectionIcon
                              className={`w-4 h-4 sm:w-5 sm:h-5 text-${section.color}-600`}
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {section.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 font-normal">
                              {section.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs bg-${section.color}-100 text-${section.color}-700 border-${section.color}-200`}
                          >
                            {isOpen ? "Expanded" : "Collapsed"}
                          </Badge>
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <SectionComponent />
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Quick Actions</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setOpenSections({
                      payment: true,
                      customer: true,
                      receipt: true,
                      tax: true,
                      access: true,
                    })
                  }
                  className="text-xs sm:text-sm px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={() =>
                    setOpenSections({
                      payment: false,
                      customer: false,
                      receipt: false,
                      tax: false,
                      access: false,
                    })
                  }
                  className="text-xs sm:text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
