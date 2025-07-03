import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/pos-utils";

const DashboardCard = ({ title, value, icon: Icon, iconColor, unit }) => (
  <Card className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl sm:p-5 lg:p-6">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor} flex-shrink-0`} />
        <span className="text-xs font-medium leading-tight text-gray-700 truncate sm:text-sm">
          {title}
        </span>
      </div>
      <span className="flex-shrink-0 ml-2 text-xs font-medium text-gray-400 uppercase">
        {unit}
      </span>
    </div>
    <div className="space-y-1.5 sm:space-y-2">
      <div className="text-xl font-bold leading-tight text-gray-900 break-all sm:text-2xl lg:text-3xl">
        {typeof value === "number" && unit === "USD"
          ? formatCurrency(value)
          : value}
      </div>
    </div>
  </Card>
);

export default DashboardCard;
