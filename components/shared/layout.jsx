"use client";

import { PageHeader } from "@/components/shared/header";

const PageLayout = ({ title, subtitle, children, headerActions }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4 sm:p-6 flex-1">
        <div className="mx-auto space-y-6 max-w-7xl">
          <PageHeader title={title} subtitle={subtitle} />
          {headerActions && (
            <div className="flex justify-end">{headerActions}</div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export { PageLayout };
