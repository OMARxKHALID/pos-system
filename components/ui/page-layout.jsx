"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { PageHeader } from "@/components/shared/header";
import React, { useState } from "react";

const PageLayout = ({ title, subtitle, children, headerActions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  return (
    <div className="min-h-screen bg-background">
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
