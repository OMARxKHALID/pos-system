"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import { Receipt, Save, RotateCcw } from "lucide-react";

export function ReceiptSettings() {
  const {
    receiptHeader,
    receiptFooter,
    autoPrintReceipt,
    includeTaxBreakdown,
    setReceiptHeader,
    setReceiptFooter,
    setAutoPrintReceipt,
    setIncludeTaxBreakdown,
    resetPaymentSettings,
  } = usePaymentSettingsStore();

  const [tempHeader, setTempHeader] = useState(receiptHeader);
  const [tempFooter, setTempFooter] = useState(receiptFooter);

  const handleSaveReceipt = () => {
    setReceiptHeader(tempHeader);
    setReceiptFooter(tempFooter);
  };

  const resetReceiptSettings = () => {
    setReceiptHeader("Thank you for your order!");
    setReceiptFooter("Please come again!");
    setAutoPrintReceipt(true);
    setIncludeTaxBreakdown(true);
    setTempHeader("Thank you for your order!");
    setTempFooter("Please come again!");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Receipt Settings */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Receipt Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Label
              htmlFor="receipt-header"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Receipt Header
            </Label>
            <Textarea
              id="receipt-header"
              value={tempHeader}
              onChange={(e) => setTempHeader(e.target.value)}
              placeholder="Enter receipt header message"
              className="bg-white border-gray-200 text-xs sm:text-sm mt-1.5 sm:mt-2"
              rows={2}
            />
          </div>

          <div>
            <Label
              htmlFor="receipt-footer"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Receipt Footer
            </Label>
            <Textarea
              id="receipt-footer"
              value={tempFooter}
              onChange={(e) => setTempFooter(e.target.value)}
              placeholder="Enter receipt footer message"
              className="bg-white border-gray-200 text-xs sm:text-sm mt-1.5 sm:mt-2"
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleSaveReceipt}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Save Receipt Settings
            </Button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="auto-print"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Auto-print Receipt
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Automatically print receipt after payment
                </p>
              </div>
              <Switch
                id="auto-print"
                checked={autoPrintReceipt}
                onCheckedChange={setAutoPrintReceipt}
              />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
              <div>
                <Label
                  htmlFor="tax-breakdown"
                  className="text-xs sm:text-sm font-medium text-gray-700"
                >
                  Include Tax Breakdown
                </Label>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Show tax details on receipt
                </p>
              </div>
              <Switch
                id="tax-breakdown"
                checked={includeTaxBreakdown}
                onCheckedChange={setIncludeTaxBreakdown}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={resetReceiptSettings}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset Receipt Settings
        </Button>
      </div>
    </div>
  );
}
