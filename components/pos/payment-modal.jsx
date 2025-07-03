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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useDownloadReceiptStore } from "@/hooks/use-pos-settings-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PaymentModal({ open, onOpenChange, total, onConfirm }) {
  const [customerName, setCustomerName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const downloadReceipt = useDownloadReceiptStore((state) => state.open);
  const setDownloadReceipt = useDownloadReceiptStore((state) => state.switch);

  const paymentMethods = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "card", label: "Credit Card", icon: CreditCard },
    { value: "wallet", label: "Mobile Pay", icon: Smartphone },
  ];

  const handleConfirm = () => {
    onConfirm(customerName, selectedPaymentMethod, downloadReceipt);
    setCustomerName("");
    setSelectedPaymentMethod("cash");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Complete Order</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer-name" className="text-sm font-medium">
              Customer Name (Optional)
            </Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Payment Method</Label>
            <Select
              value={selectedPaymentMethod}
              onValueChange={(value) => setSelectedPaymentMethod(value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Switch
              id="download-receipt-switch"
              checked={downloadReceipt}
              onCheckedChange={setDownloadReceipt}
            />
            <Label htmlFor="download-receipt-switch" className="text-sm">
              Download receipt after order
            </Label>
          </div>

          <Button onClick={handleConfirm} className="w-full">
            Complete Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
