"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCartStore } from "@/hooks/use-cart-store";
import { QuantityControl } from "@/components/ui/quantity-control";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export const ItemDetailModal = ({
  selectedItem = null,
  setSelectedItem = () => {},
}) => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
      setNotes("");
    }
  }, [selectedItem]);

  if (!selectedItem) return null;

  const {
    name,
    image,
    icon,
    category = "Uncategorized",
    price,
    description,
  } = selectedItem;

  const handleClose = () => setSelectedItem(null);

  const handleAddToCart = () => {
    addToCart(selectedItem, quantity, notes.trim() || undefined);
    handleClose();
  };

  return (
    <Dialog
      open={!!selectedItem}
      onOpenChange={(open) => !open && handleClose()}
    >
      <DialogContent
        className="flex items-center justify-center w-full max-w-xs p-0 bg-transparent border-0 shadow-none rounded-2xl"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Card className="relative w-full overflow-hidden border-0 shadow-lg bg-white/95 backdrop-blur-xl rounded-2xl">
          <DialogClose onClick={handleClose} asChild />
          <CardContent className="p-6 pt-4">
            <DialogTitle className="mb-4 text-base font-bold text-center text-slate-800">
              {name}
            </DialogTitle>
            <div className="relative flex items-center justify-center w-full h-40 mx-auto mb-4 overflow-hidden rounded-xl bg-slate-50">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="text-9xl text-slate-300">{icon || "🍔"}</div>
              )}
            </div>
            <div className="mb-4 text-center">
              <Badge
                variant="secondary"
                className="mb-2 border rounded-md text-xs px-2 py-0.5 bg-gray-100 text-gray-700 border-gray-200"
              >
                {category}
              </Badge>
              <p className="mb-2 text-lg font-bold text-blue-600">
                ${price.toFixed(2)}
              </p>
              {description && (
                <p className="mb-3 text-sm text-slate-600">{description}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-xs font-medium text-slate-600">
                Special Instructions
              </label>
              <Input
                placeholder="Add notes (e.g. no onions, extra sauce)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs rounded-lg h-9 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-slate-700">
                Quantity
              </span>
              <QuantityControl
                quantity={quantity}
                onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                onIncrease={() => setQuantity(quantity + 1)}
                min={1}
              />
            </div>
            <Button
              className="w-full h-10 text-sm font-semibold text-white transition-colors bg-blue-500 rounded-lg shadow hover:bg-blue-600"
              onClick={handleAddToCart}
              disabled={!selectedItem}
            >
              Add to Cart - ${(price * quantity).toFixed(2)}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
