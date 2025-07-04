"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Minus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import { formatCurrency } from "@/utils/formatters";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function ItemDetailModal({ selectedItem, onClose }) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedItem) {
      setQuantity(1);
    }
  }, [selectedItem]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    // Create a safe item object with validated values
    const safeItem = {
      ...selectedItem,
      name: displayName,
      icon: displayIcon,
      price: displayPrice,
      category: categoryName,
      description: displayDescription,
    };

    addToCart(safeItem, quantity);
    onClose();
  };

  if (!selectedItem) return null;

  const {
    name,
    image,
    icon,
    category = "Uncategorized",
    price,
    description,
  } = selectedItem;

  // Ensure category is always a string
  const categoryName =
    typeof category === "object" && category !== null
      ? category.name || "Uncategorized"
      : category || "Uncategorized";

  // Ensure all displayed values are strings
  const displayName = typeof name === "string" ? name : "Unknown Item";
  const displayDescription = typeof description === "string" ? description : "";
  const displayIcon = typeof icon === "string" ? icon : "🍔";
  const displayPrice = typeof price === "number" && !isNaN(price) ? price : 0;

  return (
    <Dialog open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-0 bg-transparent border-0 shadow-none">
        <Card className="overflow-hidden border-0 rounded-lg shadow-lg bg-card">
          <CardContent className="p-4">
            <VisuallyHidden>
              <DialogTitle className="mb-2 text-center text-lg font-bold">
                {displayName}
              </DialogTitle>
            </VisuallyHidden>

            <div className="relative flex items-center justify-center w-full h-32 mx-auto mb-3 overflow-hidden rounded-md bg-gradient-to-br from-muted/50 to-muted">
              {image ? (
                <div className="text-8xl text-muted-foreground">
                  {displayIcon}
                </div>
              ) : (
                <div className="text-8xl text-muted-foreground">
                  {displayIcon}
                </div>
              )}
            </div>

            <div className="mb-3 text-center">
              <Badge variant="secondary" className="mb-2 text-[10px] h-4 px-2">
                <Package className="w-2 h-2 mr-1" />
                {categoryName}
              </Badge>
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {displayName}
              </h3>
              {displayDescription && (
                <p className="mb-2 text-xs text-muted-foreground">
                  {displayDescription}
                </p>
              )}
              <p className="text-lg font-bold text-primary">
                {formatCurrency(displayPrice)}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 bg-transparent rounded-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-sm font-semibold text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="w-8 h-8 p-0 bg-transparent rounded-md"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <Button
              className="w-full text-sm font-medium rounded-md h-9"
              onClick={handleAddToCart}
            >
              Add to Cart ({formatCurrency(displayPrice * quantity)})
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
