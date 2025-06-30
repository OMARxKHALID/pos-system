"use client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { orderTracking } from "@/data/menu-data";
import { usePOSStore } from "@/hooks/use-pos-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const TrackOrder = () => {
  const { cartOpen } = usePOSStore();

  // Dummy refresh handler
  const handleRefresh = () => {
    // Implement refresh logic here
  };

  return (
    <Card className="px-4 py-3 border-0 border-t shadow-none border-slate-200/50 bg-white/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">
            Track Order
          </span>
          <Badge className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
            {orderTracking.length}
          </Badge>
        </div>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>

      <div
        className={`grid gap-4 transition-all duration-300 ${
          cartOpen ? "grid-cols-4" : "grid-cols-6 xl:grid-cols-8"
        }`}
      >
        {orderTracking.map((order, index) => (
          <div key={index} className="text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-12 h-12 mx-auto mb-2">
                  <AvatarFallback className="text-sm font-semibold text-gray-600 bg-gray-200">
                    {order.name[0]}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <span>{order.name}</span>
              </TooltipContent>
            </Tooltip>
            <p className="flex items-center justify-center gap-1 mb-1 text-sm font-semibold text-gray-800">
              <span>{order.name}</span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${order.statusColor}`}
                title={order.status}
              ></span>
            </p>
            <p className="mb-2 text-xs text-gray-500">{order.table}</p>
            <Badge
              className={`text-xs mb-2 border-0 rounded-md px-2 py-1 ${order.statusColor}`}
            >
              {order.status}
            </Badge>
            <p className="text-xs text-gray-400">{order.time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
