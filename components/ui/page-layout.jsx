"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { PageHeader } from "@/components/shared/header";
import { usePOSStore } from "@/hooks/use-pos-store";

const PageLayout = ({ title, subtitle, children, headerActions }) => {
  const { sidebarOpen, toggleSidebar } = usePOSStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      <div className="p-6">
        <div className="mx-auto space-y-6 max-w-7xl">
          <PageHeader title={title} subtitle={subtitle}>
            {headerActions}
          </PageHeader>
          {children}
        </div>
      </div>
    </div>
  );
};

export { PageLayout };
