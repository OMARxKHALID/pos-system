"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Menu, Calendar, Clock, Circle, ShoppingCart } from "lucide-react";
import { usePOSStore } from "@/hooks/use-pos-store";

export const PageHeader = ({
  title,
  subtitle,
  showCartToggle = false,
  children,
}) => {
  const { toggleSidebar, toggleCart, orderType } = usePOSStore();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 transition-colors rounded-lg text-blue-400 hover:bg-blue-50"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <span className="text-lg font-normal text-slate-500">
              / {subtitle}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {children}

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Wed, 29 May 2024</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-medium">07:59</span>
            <span className="text-slate-400">AM</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Circle
              className={`h-2 w-2 ${
                orderType === "open"
                  ? "fill-emerald-500 text-emerald-500"
                  : "fill-red-500 text-red-500"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                orderType === "open" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {orderType === "open" ? "Open Order" : "Close Order"}
            </span>
          </div>
          {showCartToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="transition-colors rounded-lg h-7 w-7 text-slate-600 hover:bg-slate-100"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
