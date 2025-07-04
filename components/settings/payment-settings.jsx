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
  Receipt,
  User,
  Save,
  RotateCcw,
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
    <div className="space-y-6 sm:space-y-8">
      {/* Default Payment Method */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Label
              htmlFor="default-payment"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Default Payment Method
            </Label>
            <Select
              value={defaultPaymentMethod}
              onValueChange={setDefaultPaymentMethod}
            >
              <SelectTrigger className="mt-1.5 sm:mt-2 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((method) => {
                  const Icon = method.icon;
                  return (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        {method.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
              Preferred Payment Methods
            </Label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {paymentMethodOptions.map((method) => {
                const Icon = method.icon;
                const isSelected = preferredPaymentMethods.includes(
                  method.value
                );
                return (
                  <Badge
                    key={method.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 text-xs sm:text-sm ${
                      isSelected
                        ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => togglePaymentMethod(method.value)}
                  >
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1.5 sm:mr-2" />
                    {method.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Settings */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50/50 to-emerald-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            Customer Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Label
              htmlFor="default-customer"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Default Customer Name
            </Label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1.5 sm:mt-2">
              <Input
                id="default-customer"
                value={tempCustomerName}
                onChange={(e) => setTempCustomerName(e.target.value)}
                placeholder="Enter default customer name"
                className="bg-white border-gray-200 text-xs sm:text-sm"
              />
              <Button
                onClick={handleSaveCustomerName}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="auto-fill"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Auto-fill Customer Name
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Automatically fill customer name field
                </p>
              </div>
              <Switch
                id="auto-fill"
                checked={autoFillCustomerName}
                onCheckedChange={setAutoFillCustomerName}
              />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="remember-customer"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Remember Last Customer
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Remember the last customer name used
                </p>
              </div>
              <Switch
                id="remember-customer"
                checked={rememberLastCustomer}
                onCheckedChange={setRememberLastCustomer}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Settings */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50/50 to-violet-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            Receipt Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="download-receipt"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Download Receipt
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Automatically download receipt after order
                </p>
              </div>
              <Switch
                id="download-receipt"
                checked={downloadReceipt}
                onCheckedChange={setDownloadReceipt}
              />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="auto-print"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Auto Print Receipt
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Automatically print receipt after order
                </p>
              </div>
              <Switch
                id="auto-print"
                checked={autoPrintReceipt}
                onCheckedChange={setAutoPrintReceipt}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="receipt-template"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Receipt Template
            </Label>
            <Select value={receiptTemplate} onValueChange={setReceiptTemplate}>
              <SelectTrigger className="mt-1.5 sm:mt-2 bg-white border-gray-200">
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
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={resetPaymentSettings}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
