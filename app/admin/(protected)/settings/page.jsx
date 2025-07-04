"use client";

import { useRef } from "react";
import { Settings } from "lucide-react";
import { useAdminSidebarStore } from "@/hooks/zustand/use-admin-sidebar-store";
import { PaymentSettings } from "@/components/settings/payment-settings";

export default function SettingsPage() {
  const linkRef = useRef(null);
  const toggleSidebar = useAdminSidebarStore((s) => s.toggle);

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto space-y-3 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>
          </div>
          <button
            ref={linkRef}
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <PaymentSettings />
      </div>
    </div>
  );
}
