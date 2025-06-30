"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export const QuantityControl = ({
  quantity,
  onDecrease,
  onIncrease,
  disabled = false,
  size = "md",
  min = 1,
}) => {
  const buttonSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} rounded border bg-background`}
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
      >
        <Minus className={iconSize} />
      </Button>
      <span className={`${textSize} font-semibold w-6 text-center`}>
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={`${buttonSize} rounded border bg-background`}
        onClick={onIncrease}
        disabled={disabled}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
};
