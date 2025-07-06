"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import { User, Save, RotateCcw } from "lucide-react";

export function CustomerSettings() {
  const {
    defaultCustomerName,
    autoFillCustomerName,
    rememberLastCustomer,
    setDefaultCustomerName,
    setAutoFillCustomerName,
    setRememberLastCustomer,
  } = usePaymentSettingsStore();

  const [tempCustomerName, setTempCustomerName] = useState(defaultCustomerName);

  const handleSaveCustomerName = () => {
    setDefaultCustomerName(tempCustomerName);
  };

  const resetCustomerSettings = () => {
    setDefaultCustomerName("");
    setAutoFillCustomerName(true);
    setRememberLastCustomer(false);
    setTempCustomerName("");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {/* Reset Button */}
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={resetCustomerSettings}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset Customer Settings
        </Button>
      </div>
    </div>
  );
}
