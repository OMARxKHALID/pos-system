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
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { formatCurrency } from "@/utils/formatters";
import { paymentMethodOptions } from "@/utils/constants";

export function PaymentModal({ open, onOpenChange, total, onConfirm }) {
  const {
    defaultPaymentMethod,
    getDefaultCustomerName,
    updateLastCustomer,
    downloadReceipt,
    setDownloadReceipt,
    preferredPaymentMethods,
  } = usePaymentSettingsStore();

  // Use store values directly for live updates
  const [customerName, setCustomerName] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Sync with store when modal opens or store values change
  useEffect(() => {
    if (open) {
      setCustomerName(getDefaultCustomerName());
      setSelectedPaymentMethod(defaultPaymentMethod);
    }
  }, [open, getDefaultCustomerName, defaultPaymentMethod]);

  // Map icon names to actual icon components
  const iconMap = {
    Banknote,
    CreditCard,
    Smartphone,
  };

  const allPaymentMethods = paymentMethodOptions.map((method) => ({
    ...method,
    icon: iconMap[method.icon],
  }));

  // Filter payment methods based on preferences
  const paymentMethods =
    preferredPaymentMethods.length > 0
      ? allPaymentMethods.filter((method) =>
          preferredPaymentMethods.includes(method.value)
        )
      : allPaymentMethods;

  const handleConfirm = () => {
    onConfirm(customerName, selectedPaymentMethod, downloadReceipt);
    updateLastCustomer(customerName);
    setCustomerName(getDefaultCustomerName());
    setSelectedPaymentMethod(defaultPaymentMethod);
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
                <span>{formatCurrency(total)}</span>
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
