"use client";

import { Button } from "@/components/ui/button";
import { Edit3, X } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { Input } from "@/components/ui/input";
import { OrderItem } from "./order-item";
import { useState, useMemo } from "react";
import { ReceiptGenerator } from "./receipt-generator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { calculateOrderTotals } from "@/utils/pos-utils";

function generateOrderNumber() {
  return (
    "ORD-" +
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
      .replace(/[018]/g, (c) =>
        (
          (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & 15)) >>
          (c / 4)
        ).toString(16)
      )
      .toUpperCase()
  );
}

export const OrderCart = ({
  cartOpen = false,
  toggleCart = () => {},
  selectedTable = "",
  selectedOrderType = "",
  customerName = "",
  orderNumber = "",
  setOrderHistory = () => {},
}) => {
  const { orderItems } = useCartStore();
  const [localOrderNumber] = useState(orderNumber || generateOrderNumber());
  const [editCustomerNameModalOpen, setEditCustomerNameModalOpen] =
    useState(false);
  const [localCustomerName, setLocalCustomerName] = useState(
    customerName || ""
  );
  const [tempCustomerName, setTempCustomerName] = useState(customerName || "");
  const [printReceipt, setPrintReceipt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  const totals = useMemo(
    () => calculateOrderTotals(orderItems, false),
    [orderItems]
  );

  const openEditCustomerNameModal = () => {
    setTempCustomerName(localCustomerName);
    setEditCustomerNameModalOpen(true);
  };

  const closeEditCustomerNameModal = () => setEditCustomerNameModalOpen(false);

  const handleSaveCustomerName = () => {
    setLocalCustomerName(tempCustomerName.trim() || "Guest");
    closeEditCustomerNameModal();
  };

  const handlePlaceOrder = () => {
    if (!orderItems.length) return;
    const now = new Date();
    const orderData = {
      items: orderItems,
      table: selectedTable,
      type: selectedOrderType,
      customerName: localCustomerName || "Guest",
      orderNumber: localOrderNumber,
      totalPayment: totals.total,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setOrderHistory((prev) => [...prev, orderData]);
    setLastOrderData(orderData);
    setPrintReceipt(true);
  };

  return (
    <div
      className={`bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 ease-in-out ${
        cartOpen
          ? "w-[380px] opacity-100 translate-x-0 m-3 ml-1.5"
          : "w-0 opacity-0 translate-x-full pointer-events-none m-0"
      }`}
    >
      {/* Header */}
      <header className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {localCustomerName || "Guest"}'s Order
            </h2>
            <p className="text-sm text-gray-500">
              Order Number: #{localOrderNumber.replace("ORD-", "")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg hover:bg-gray-100"
              onClick={openEditCustomerNameModal}
              aria-label="Edit customer name"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg hover:bg-gray-100 lg:hidden"
              onClick={toggleCart}
              aria-label="Close cart"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <main className="flex-1 px-6 py-4 overflow-y-auto">
        {orderItems.length === 0 ? (
          <div className="mt-12 text-center text-gray-400">
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

      {/* Totals & Place Order */}
      <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/50">
        <div className="mb-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              ${totals.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%)</span>
            <span className="font-medium text-gray-900">
              ${totals.tax.toFixed(2)}
            </span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600">Discount</span>
              <span className="font-medium text-emerald-600">
                -${totals.discount.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between pt-3 mb-5 text-base font-semibold border-t border-gray-200">
          <span className="text-gray-900">TOTAL</span>
          <span className="text-gray-900">${totals.total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full h-12 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePlaceOrder}
          disabled={!orderItems.length}
        >
          Place Order
        </Button>
      </div>

      {/* Edit Customer Name Modal */}
      <Dialog
        open={editCustomerNameModalOpen}
        onOpenChange={setEditCustomerNameModalOpen}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              Edit Customer Name
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              value={tempCustomerName}
              onChange={(e) => setTempCustomerName(e.target.value)}
              className="rounded-lg"
              placeholder="Enter customer name"
              onKeyDown={(e) => {
                if (e.key === "Enter" && tempCustomerName.trim())
                  handleSaveCustomerName();
              }}
            />
          </div>
          <DialogFooter>
            <Button
              className="w-full h-10 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={handleSaveCustomerName}
              disabled={!tempCustomerName.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Generator */}
      <ReceiptGenerator
        open={printReceipt}
        orderData={lastOrderData}
        totals={totals}
        onPrinted={() => setPrintReceipt(false)}
      />
    </div>
  );
};
