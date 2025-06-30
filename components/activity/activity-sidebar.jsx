"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ActivitySidebar = ({ activeView, onViewChange }) => {
  const views = [
    { id: "billing-queue", label: "Billing Queue" },
    { id: "tables", label: "Tables" },
    { id: "order-history", label: "Order History" },
  ];

  return (
    <div className="w-64 space-y-4">
      <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-4">
          <div className="space-y-2">
            {views.map((view) => (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                className={`w-full justify-start h-12 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeView === view.id
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => onViewChange(view.id)}
              >
                {view.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-6">
          <h3 className="mb-3 text-xl font-bold text-blue-600">Bakehouse POS</h3>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            The dreamy taste & magic of sweet moments in every bite from our
            bakery
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© 2024 Bakehouse POS</span>
            <span className="cursor-pointer hover:text-blue-600">Contacts</span>
            <span className="cursor-pointer hover:text-blue-600">Help</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { ActivitySidebar };
