"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentSettingsStore } from "@/hooks/zustand/use-payment-settings-store";
import { Receipt } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

export function ReceiptSettings() {
  const { downloadReceipt, setDownloadReceipt, resetPaymentSettings } =
    usePaymentSettingsStore();

  const handleReset = () => {
    resetPaymentSettings();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            Receipt Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
            <div>
              <Label
                htmlFor="download-receipt"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Download Receipt by Default
              </Label>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                When enabled, receipts will be automatically downloaded after
                placing an order.
              </p>
            </div>
            <Switch
              id="download-receipt"
              checked={downloadReceipt}
              onCheckedChange={setDownloadReceipt}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={handleReset}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset Receipt Settings
        </Button>
      </div>
    </div>
  );
}
