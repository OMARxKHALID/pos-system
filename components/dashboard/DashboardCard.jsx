import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  delta,
  deltaPercentage,
  unit,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className={`w-5 h-5 ${iconColor}`} /> {title}
      </div>
      <span className="text-xs text-gray-400">{unit}</span>
    </CardHeader>
    <CardContent>
      <div className="mb-1 text-3xl font-bold text-gray-900">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={`${
              delta > 0 ? "text-green-600" : "text-red-500"
            } font-semibold`}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
        {deltaPercentage && (
          <span
            className={`${
              deltaPercentage > 0 ? "text-green-600" : "text-red-500"
            } font-semibold`}
          >
            {deltaPercentage > 0 ? "+" : ""}
            {deltaPercentage}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

export default DashboardCard;
