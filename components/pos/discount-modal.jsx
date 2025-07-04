"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { useState, useEffect } from "react";
import { clampDiscountPercentage } from "@/utils/pos-utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function DiscountModal({
  open,
  onOpenChange,
  currentDiscount,
  type,
  itemId,
  itemName,
}) {
  const {
    applyItemDiscount,
    applyCartDiscount,
    removeItemDiscount,
    removeCartDiscount,
  } = useCartStore();
  const [tempDiscount, setTempDiscount] = useState("");

  useEffect(() => {
    if (open) {
      setTempDiscount(currentDiscount.toString());
    }
  }, [open, currentDiscount]);

  const handleApplyDiscount = () => {
    const discount = clampDiscountPercentage(
      Number.parseFloat(tempDiscount) || 0
    );

    if (type === "item" && itemId) {
      applyItemDiscount(itemId, discount);
    } else if (type === "cart") {
      applyCartDiscount(discount);
    }

    onOpenChange(false);
  };

  const handleRemoveDiscount = () => {
    if (type === "item" && itemId) {
      removeItemDiscount(itemId);
    } else if (type === "cart") {
      removeCartDiscount();
    }

    onOpenChange(false);
  };

  const title =
    type === "item" ? `Item Discount - ${itemName}` : "Apply Cart Discount";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>{title}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="discount" className="text-sm font-medium">
              Discount Percentage
            </Label>
            <Input
              id="discount"
              type="number"
              value={tempDiscount}
              onChange={(e) => setTempDiscount(e.target.value)}
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApplyDiscount} className="flex-1">
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleRemoveDiscount}
              className="flex-1 bg-transparent"
            >
              Remove
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
