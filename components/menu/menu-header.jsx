import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Download, Menu, Plus } from "lucide-react";

export default function AdminMenuHeader({
  toggleSidebar,
  data,
  linkRef,
  onAdd,
}) {
  return (
    <Card className="border border-gray-200 bg-white shadow-sm sm:rounded-xl">
      <CardHeader className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 p-2 hover:bg-gray-100 sm:p-2"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
          <Utensils className="h-7 w-7 text-gray-600" />
          <h1 className="truncate text-xl sm:text-2xl font-semibold text-gray-900 max-w-[60vw] sm:max-w-none">
            Menu Management
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="truncate text-xs font-medium text-gray-700 sm:text-sm">
            {data?.length || 0} Items
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onAdd}
            aria-label="Add New Item"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // TODO: Implement menu export functionality
              console.log("Export menu");
            }}
            aria-label="Download menu"
          >
            <Download className="h-5 w-5 text-gray-600" />
          </Button>
          <a ref={linkRef} style={{ display: "none" }} />
        </div>
      </CardHeader>
    </Card>
  );
}
