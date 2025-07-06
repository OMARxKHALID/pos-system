"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTaxSettingsStore } from "@/hooks/zustand/use-tax-settings-store";
import { Calculator, Percent, Save, RotateCcw } from "lucide-react";

export function TaxSettings() {
  const {
    enableTax,
    taxRate,
    taxName,
    setEnableTax,
    setTaxRate,
    setTaxName,
    resetTaxSettings,
  } = useTaxSettingsStore();

  const [tempTaxName, setTempTaxName] = useState(taxName);

  const handleSaveTaxName = () => {
    setTaxName(tempTaxName);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Tax Enable/Disable */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-red-50/50 to-orange-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            Tax Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between p-3 sm:p-4 bg-white/60 rounded-lg border border-gray-100">
            <div>
              <Label
                htmlFor="enable-tax"
                className="text-xs sm:text-sm font-medium text-gray-700"
              >
                Enable Tax Calculation
              </Label>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Enable or disable tax calculation for all orders
              </p>
            </div>
            <Switch
              id="enable-tax"
              checked={enableTax}
              onCheckedChange={setEnableTax}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tax Rate Settings */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            Tax Rate & Name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Label
              htmlFor="tax-name"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Tax Name
            </Label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1.5 sm:mt-2">
              <Input
                id="tax-name"
                value={tempTaxName}
                onChange={(e) => setTempTaxName(e.target.value)}
                placeholder="e.g., Sales Tax, VAT, GST"
                className="bg-white border-gray-200 text-xs sm:text-sm"
              />
              <Button
                onClick={handleSaveTaxName}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Save
              </Button>
            </div>
          </div>

          <div>
            <Label
              htmlFor="tax-rate"
              className="text-xs sm:text-sm font-medium text-gray-700"
            >
              Tax Rate (%)
            </Label>
            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
              <Input
                id="tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="bg-white border-gray-200 text-xs sm:text-sm"
              />
              <span className="text-xs sm:text-sm text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Current rate: {taxRate}% (will be applied to order subtotals)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="flex justify-end pt-3 sm:pt-4">
        <Button
          variant="outline"
          onClick={resetTaxSettings}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
        >
          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
