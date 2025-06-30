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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-card-foreground">
              {title}
            </h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-card-foreground">
              {unit === "USD"
                ? formatCurrency(value).replace("$", "")
                : value.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {unit}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                trend === "up" ? "text-emerald-600" : "text-destructive"
              }`}
            >
              {trend === "up" ? "+" : ""}
              {unit === "USD" ? `$${change.toFixed(2)}` : `${change} ${unit}`}
            </span>
            <div
              className={`flex items-center gap-1 ${
                trend === "up" ? "text-emerald-600" : "text-destructive"
              }`}
            >
              <span className="text-sm font-semibold">{percentage}%</span>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
