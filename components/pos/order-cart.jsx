"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, X, Check } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { Input } from "@/components/ui/input";
import { OrderItem } from "./order-item";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export const OrderCart = ({
  cartOpen = false,
  toggleCart = () => {},
  orderItems = [],
  promoApplied = false,
  selectedTable = "",
  setTable = () => {},
  selectedOrderType = "",
  setOrderType = () => {},
  customerName = "",
  orderNumber = "",
  togglePromo = () => {},
}) => {
  const [editCustomerNameModalOpen, setEditCustomerNameModalOpen] =
    useState(false);
  const [localCustomerName, setLocalCustomerName] = useState(customerName);
  const [tempCustomerName, setTempCustomerName] = useState(customerName);

  const openEditCustomerNameModal = () => {
    setTempCustomerName(localCustomerName);
    setEditCustomerNameModalOpen(true);
  };
  const closeEditCustomerNameModal = () => setEditCustomerNameModalOpen(false);

  const handleSaveCustomerName = () => {
    setLocalCustomerName(tempCustomerName.trim() || "Guest");
    closeEditCustomerNameModal();
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + tax - discount;

  return (
    <div
      className={`bg-white/70 backdrop-blur-xl rounded-2xl flex flex-col overflow-hidden border border-white/50 transition-all duration-300 ease-in-out ${
        cartOpen
          ? "w-[320px] opacity-100 translate-x-0 m-3 ml-1.5"
          : "w-0 opacity-0 translate-x-full pointer-events-none m-0"
      }`}
    >
      {/* Cart Header */}
      <header className="px-4 py-4 border-b border-slate-200/50 bg-white/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Input
              value={localCustomerName}
              readOnly
              className="h-auto p-0 text-base font-semibold bg-transparent border-0 cursor-pointer text-slate-800 focus:ring-0 focus:border-0"
              style={{ width: "auto", minWidth: "120px" }}
              onClick={openEditCustomerNameModal}
            />
            <p className="text-xs text-slate-500">
              Order Number: {orderNumber}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 rounded-lg"
              onClick={openEditCustomerNameModal}
            >
              <Edit3 className="h-3.5 w-3.5 text-slate-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 rounded-lg lg:hidden"
              onClick={toggleCart}
            >
              <X className="h-3.5 w-3.5 text-slate-400" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedTable} onValueChange={setTable}>
            <SelectTrigger className="flex-1 text-xs rounded-lg h-9 border-slate-200">
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Table 01">Table 01</SelectItem>
              <SelectItem value="Table 02">Table 02</SelectItem>
              <SelectItem value="Table 03">Table 03</SelectItem>
              <SelectItem value="Table 04">Table 04</SelectItem>
              <SelectItem value="Table 05">Table 05</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedOrderType} onValueChange={setOrderType}>
            <SelectTrigger className="flex-1 text-xs rounded-lg h-9 border-slate-200">
              <SelectValue placeholder="Order Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dine In">Dine In</SelectItem>
              <SelectItem value="Take Away">Take Away</SelectItem>
              <SelectItem value="Delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Order Items */}
      <main className="flex-1 p-4 overflow-y-auto">
        {orderItems.length === 0 ? (
          <div className="mt-8 text-center text-slate-400">
            <p className="text-sm font-medium">No Item Selected</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <OrderItem
                key={item.id}
                item={item}
                showCheckmark={index === 1 || index === 2}
              />
            ))}
          </div>
        )}
      </main>

      {/* Order Summary */}
      <Card className="bg-transparent border-0 rounded-none">
        <CardContent className="p-4 border-t border-slate-200/50 bg-white/30">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-800">
                $ {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Tax (10%)</span>
              <span className="font-semibold text-slate-800">
                $ {tax.toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600">Discount</span>
                <span className="font-semibold text-emerald-600">
                  -$ {discount.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2 mb-4 text-sm font-bold border-t border-slate-200">
            <span className="text-slate-800">TOTAL</span>
            <span className="text-slate-800">$ {total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={promoApplied ? "default" : "outline"}
              className={`flex-1 h-8 rounded-lg text-xs ${
                promoApplied
                  ? "bg-emerald-500 text-white"
                  : "border-slate-200 text-slate-600"
              }`}
              onClick={togglePromo}
            >
              {promoApplied ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  Promo Applied
                </>
              ) : (
                "Add Promo"
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs bg-transparent rounded-lg border-slate-200 text-slate-600"
            >
              QRIS
            </Button>
          </div>

          <Button className="w-full h-10 text-sm font-semibold text-white bg-blue-500 rounded-xl">
            Place Order
          </Button>
        </CardContent>
      </Card>

      {/* Dialog for editing customer name */}
      <Dialog
        open={editCustomerNameModalOpen}
        onOpenChange={setEditCustomerNameModalOpen}
      >
        <DialogContent className="flex items-center justify-center w-full max-w-xs p-0 bg-transparent border-0 shadow-2xl rounded-2xl">
          <Card className="relative w-full border-0 shadow-lg bg-white/95 backdrop-blur-xl rounded-2xl">
            {/* Single close button in top right */}
            <DialogClose asChild />
            <CardContent className="p-6 pt-4">
              <DialogTitle className="mb-4 text-base font-bold text-center text-slate-800">
                Edit Customer Name
              </DialogTitle>
              <Input
                autoFocus
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
                className="mb-5 rounded-lg h-9"
                placeholder="Enter customer name"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tempCustomerName.trim())
                    handleSaveCustomerName();
                }}
              />
              <DialogFooter>
                <Button
                  className="w-full h-10 text-sm font-semibold text-white bg-blue-500 rounded-lg shadow"
                  onClick={handleSaveCustomerName}
                  disabled={!tempCustomerName.trim()}
                >
                  Save
                </Button>
              </DialogFooter>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
