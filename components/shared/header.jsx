"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Circle, ShoppingCart } from "lucide-react";

export const PageHeader = ({
  title,
  subtitle,
  showCartToggle = false,
  children,
  toggleCart = () => {},
  orderType = "open",
}) => {
  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold leading-tight text-slate-800">
            {title}
          </h1>
          {subtitle && (
            <div className="text-base font-normal text-slate-500 mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        {children}

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Wed, 29 May 2024</span>
          </div>
          <span className="hidden w-px h-5 md:block bg-slate-300" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">07:59</span>
            <span className="text-slate-400">AM</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Circle
              className={`h-2.5 w-2.5 ${
                orderType === "open"
                  ? "fill-emerald-500 text-emerald-500"
                  : "fill-red-500 text-red-500"
              }`}
            />
            <span
              className={`text-sm font-semibold ${
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
              className="w-8 h-8 transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={toggleCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
