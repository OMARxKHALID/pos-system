"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Settings,
  Receipt,
} from "lucide-react";

const paymentMethodOptions = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Credit Card", icon: CreditCard },
  { value: "wallet", label: "Mobile Pay", icon: Smartphone },
];

const receiptTemplateOptions = [
  { value: "standard", label: "Standard" },
  { value: "compact", label: "Compact" },
  { value: "detailed", label: "Detailed" },
];

export function PaymentSettings() {
  const {
    defaultPaymentMethod,
    defaultCustomerName,
    autoFillCustomerName,
    rememberLastCustomer,
    downloadReceipt,
    autoPrintReceipt,
    receiptTemplate,
    preferredPaymentMethods,
    hideUnusedPaymentMethods,
    setDefaultPaymentMethod,
    setDefaultCustomerName,
    setAutoFillCustomerName,
    setRememberLastCustomer,
    setDownloadReceipt,
    setAutoPrintReceipt,
    setReceiptTemplate,
    setPreferredPaymentMethods,
    setHideUnusedPaymentMethods,
    resetPaymentSettings,
  } = usePaymentSettingsStore();

  const [tempCustomerName, setTempCustomerName] = useState(defaultCustomerName);

  const handleSaveCustomerName = () => {
    setDefaultCustomerName(tempCustomerName);
  };

  const togglePaymentMethod = (method) => {
    const current = preferredPaymentMethods;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    setPreferredPaymentMethods(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Payment Settings</h2>
      </div>

      {/* Default Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Default Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default-payment">Default Payment Method</Label>
            <Select
              value={defaultPaymentMethod}
              onValueChange={setDefaultPaymentMethod}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((method) => {
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

          <div>
            <Label className="text-sm font-medium">
              Preferred Payment Methods
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {paymentMethodOptions.map((method) => {
                const Icon = method.icon;
                const isSelected = preferredPaymentMethods.includes(
                  method.value
                );
                return (
                  <Badge
                    key={method.value}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePaymentMethod(method.value)}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {method.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="default-customer">Default Customer Name</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="default-customer"
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
                placeholder="Enter default customer name"
              />
              <Button onClick={handleSaveCustomerName} size="sm">
                Save
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-fill">Auto-fill Customer Name</Label>
              <p className="text-sm text-muted-foreground">
                Automatically fill customer name field
              </p>
            </div>
            <Switch
              id="auto-fill"
              checked={autoFillCustomerName}
              onCheckedChange={setAutoFillCustomerName}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="remember-customer">Remember Last Customer</Label>
              <p className="text-sm text-muted-foreground">
                Remember the last customer name used
              </p>
            </div>
            <Switch
              id="remember-customer"
              checked={rememberLastCustomer}
              onCheckedChange={setRememberLastCustomer}
            />
          </div>
        </CardContent>
      </Card>

      {/* Receipt Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Receipt Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="download-receipt">Download Receipt</Label>
              <p className="text-sm text-muted-foreground">
                Automatically download receipt after order
              </p>
            </div>
            <Switch
              id="download-receipt"
              checked={downloadReceipt}
              onCheckedChange={setDownloadReceipt}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-print">Auto Print Receipt</Label>
              <p className="text-sm text-muted-foreground">
                Automatically print receipt after order
              </p>
            </div>
            <Switch
              id="auto-print"
              checked={autoPrintReceipt}
              onCheckedChange={setAutoPrintReceipt}
            />
          </div>

          <div>
            <Label htmlFor="receipt-template">Receipt Template</Label>
            <Select value={receiptTemplate} onValueChange={setReceiptTemplate}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {receiptTemplateOptions.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={resetPaymentSettings}
          className="text-destructive hover:text-destructive"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
