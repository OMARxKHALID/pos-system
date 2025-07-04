import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

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
        ${sales.toFixed(2)}
      </div>
    </div>
  );
};

const ReportGraph = ({ data = [] }) => {
  // Debug: Log the incoming data
  console.log("ReportGraph data:", data);

  // Format dates and map data correctly
  const chartData =
    Array.isArray(data) && data.length > 0
      ? data.map((d) => ({
          date: formatDate(d.date),
          sales: d.sales || 0,
        }))
      : [];

  console.log("Chart data:", chartData);

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "#3B82F6",
    },
  };

  // Format date for display (e.g., "Mon", "Tue", etc.)
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
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
          fontSize={window.innerWidth < 640 ? 8 : 10}
          className="font-medium"
        >
          {payload.value}
        </text>
      </g>
    );
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
      <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] sm:h-[280px] lg:h-[320px] xl:h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
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
                tick={<CustomXAxisTick />}
                interval={0}
                height={70}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis hide domain={[0, "dataMax + 10"]} />
              <ChartTooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={{
                  r: window.innerWidth < 640 ? 2 : 3,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "white",
                }}
                activeDot={{
                  r: window.innerWidth < 640 ? 3 : 4,
                  stroke: "#3B82F6",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReportGraph;
