import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/pos-utils";

const ReportGraph = ({ data = [], totalSales = 0 }) => {
  // Use backend data for chart
  const chartData =
    Array.isArray(data) && data.length > 0
      ? data.map((d) => ({
          date: d.date,
          sales: d.sales,
        }))
      : [];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#3B82F6",
    },
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
      <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-3 sm:flex-row sm:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 sm:space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
            Sales Over Time
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
        <ChartContainer
          config={chartConfig}
          className="h-[200px] sm:h-[240px] lg:h-[280px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                dy={5}
                interval={0}
              />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={false}
                activeDot={{
                  r: 3,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex flex-col items-start justify-between gap-4 pt-4 space-y-4 border-t border-gray-200 sm:flex-row sm:items-center sm:pt-6 sm:space-y-0">
          <div className="text-center sm:text-left">
            <div className="mb-1 text-xs font-medium text-gray-500 sm:text-sm">
              Total Sales
            </div>
            <div className="text-lg font-bold leading-tight text-gray-900 sm:text-xl lg:text-2xl">
              {formatCurrency(totalSales)}
            </div>
            <div className="mt-1 text-xs text-gray-400">USD</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGraph;
