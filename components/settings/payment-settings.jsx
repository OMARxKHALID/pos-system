"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import { paymentMethodOptions } from "@/utils/constants";
import { CreditCard, Banknote, Smartphone, RotateCcw } from "lucide-react";

// Map icon names to actual icon components
const iconMap = {
  Banknote,
  CreditCard,
  Smartphone,
};

const paymentMethodsWithIcons = paymentMethodOptions.map((method) => ({
  ...method,
  icon: iconMap[method.icon],
}));

export function PaymentSettings() {
  const {
    defaultPaymentMethod,
    preferredPaymentMethods,
    setDefaultPaymentMethod,
    setPreferredPaymentMethods,
    resetPaymentSettings,
  } = usePaymentSettingsStore();

  const togglePaymentMethod = (method) => {
    const current = preferredPaymentMethods;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    setPreferredPaymentMethods(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Payment Methods */}
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
            <select
              id="default-payment"
              value={defaultPaymentMethod}
              onChange={(e) => setDefaultPaymentMethod(e.target.value)}
              className="mt-1.5 sm:mt-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paymentMethodsWithIcons.map((method) => {
                const Icon = method.icon;
                return (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <Label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">
              Available Payment Methods
            </Label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {paymentMethodsWithIcons.map((method) => {
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
                        : "hover:bg-gray-200"
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

      {/* Reset Button */}
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={resetPaymentSettings}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset Payment Settings
        </Button>
      </div>
    </div>
  );
}
