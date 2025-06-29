import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const MetricCard = ({
  title,
  value,
  unit,
  change,
  percentage,
  trend,
  icon: Icon,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {unit === "USD"
                ? formatCurrency(value).replace("$", "")
                : value.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-slate-500">{unit}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "+" : ""}
              {unit === "USD" ? `$${change.toFixed(2)}` : `${change} ${unit}`}
            </span>
            <div
              className={`flex items-center gap-1 ${
                trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              <span className="text-sm font-semibold">{percentage}%</span>
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
