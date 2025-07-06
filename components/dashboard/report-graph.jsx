import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DollarSign, Calendar } from "lucide-react";

// Custom minimal tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const sales = data.value || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-sm font-semibold text-gray-900">
        {formatCurrency(sales)}
      </div>
    </div>
  );
};

const ReportGraph = ({ data = [], todaySales = 0, yesterdaySales = 0 }) => {
  // Format dates and map data correctly
  const chartData =
    Array.isArray(data) && data.length > 0
      ? data.map((d) => ({
          date: formatDate(d.date),
          sales: d.totalSales || 0,
        }))
      : [];

  // Format date for display (e.g., "Mon", "Tue", etc.)
  function formatDate(dateString) {
    const date = new Date(dateString);
    // Use a consistent format that doesn't depend on locale
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  }

  // Custom tick formatter for X-axis
  const CustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize={12}
          className="font-medium"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Check if we have any sales data
  const hasSalesData = chartData.some((item) => item.sales > 0);
  const maxSales = Math.max(...chartData.map((item) => item.sales), 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Earnings Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Today's Earnings
                </p>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(todaySales)}
                </p>
              </div>
              <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Yesterday's Earnings
                </p>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(yesterdaySales)}
                </p>
              </div>
              <div className="flex-shrink-0 p-1.5 sm:p-2 lg:p-3 bg-amber-100 rounded-lg">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
        <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-3 sm:flex-row sm:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 sm:space-y-0">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
              Sales Over Time
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
          {!hasSalesData ? (
            <div className="h-[250px] sm:h-[280px] lg:h-[300px] xl:h-[320px] w-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-sm font-medium mb-1">
                  No sales data available
                </div>
                <div className="text-xs">
                  Sales will appear here once orders are placed
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[280px] lg:h-[300px] xl:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    interval={0}
                    height={70}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    hide
                    domain={[0, maxSales > 0 ? maxSales * 1.1 : 100]}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#salesGradient)"
                    dot={{
                      r: 3,
                      stroke: "#3B82F6",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                    activeDot={{
                      r: 4,
                      stroke: "#3B82F6",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGraph;
