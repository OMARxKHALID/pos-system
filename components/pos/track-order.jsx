"use client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { usePOSStore } from "@/hooks/use-pos-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCcw, EyeOff, Eye } from "lucide-react";

export const TrackOrder = () => {
  const {
    cartOpen,
    orderTracking,
    closeTrackingOrder,
    trackOrderOpen,
    toggleTrackOrder,
  } = usePOSStore();

  const orders = Array.isArray(orderTracking) ? orderTracking : [];

  const handleRefresh = () => {
    // Optionally implement refresh logic
  };

  if (!trackOrderOpen) {
    return (
      <div className="flex justify-end px-4 py-2">
        <Button size="sm" variant="outline" onClick={toggleTrackOrder}>
          <Eye className="w-4 h-4 mr-1" />
          Show Track Order
        </Button>
      </div>
    );
  }

  return (
    <Card className="px-4 py-3 border-0 border-t border-slate-200/50 bg-white/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">
            Track Order
          </span>
          <Badge className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
            {orders.length}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={toggleTrackOrder}>
            <EyeOff className="w-4 h-4 mr-1" />
            Hide
          </Button>
        </div>
      </div>

      <TooltipProvider>
        <div
          className={`grid gap-4 transition-all duration-300 ${
            cartOpen ? "grid-cols-4" : "grid-cols-6 xl:grid-cols-8"
          }`}
        >
          {orders.map((order, index) => (
            <div key={index} className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-12 h-12 mx-auto mb-2">
                    <AvatarFallback className="text-sm font-semibold text-gray-600 bg-gray-200">
                      {order.customerName ? order.customerName[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{order.customerName}</span>
                </TooltipContent>
              </Tooltip>
              <p className="flex items-center justify-center gap-1 mb-1 text-sm font-semibold text-gray-800">
                <span>{order.customerName}</span>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${order.statusColor.replace(
                    "text-orange-600",
                    "text-orange-400"
                  ).replace("bg-orange-100", "bg-orange-50")}`}
                  title={order.status}
                ></span>
              </p>
              <p className="mb-2 text-xs text-gray-400">{order.table}</p>
              <Badge
                className={`text-xs mb-2 border-0 rounded-md px-2 py-1 ${order.statusColor.replace(
                  "text-orange-600",
                  "text-orange-400"
                ).replace("bg-orange-100", "bg-orange-50")}`}
              >
                {order.status}
              </Badge>
              <p className="text-xs text-gray-400">{order.time}</p>
              <Button
                size="xs"
                className="mt-2 text-xs"
                variant="outline"
                onClick={() => closeTrackingOrder(order.orderNumber)}
                disabled={
                  order.orderStatus === "Closed" || order.status === "Closed"
                }
              >
                {order.orderStatus === "Closed" || order.status === "Closed"
                  ? "Completed"
                  : "Complete"}
              </Button>
            </div>
          ))}
        </div>
      </TooltipProvider>
    </Card>
  );
};
