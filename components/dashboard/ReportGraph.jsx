import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

const ReportGraph = ({ data, totalSales }) => (
  <Card className="col-span-2">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-semibold">Report Graph</CardTitle>
      <CardDescription>Total Sales Amount</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="w-full h-56 p-2 bg-gradient-to-b from-blue-50/60 to-white rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              name="Sales"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Amount</span>
          <span className="text-lg font-bold text-gray-900">
            {totalSales.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Growth</span>
          <span className="text-lg font-bold text-green-600">+1,543.30</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Growth %</span>
          <span className="text-lg font-bold text-blue-600">12.2%</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ReportGraph;
