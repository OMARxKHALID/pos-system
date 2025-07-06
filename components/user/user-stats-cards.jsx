import { Card, CardContent } from "@/components/ui/card";
import { Crown, Shield, UserCheck } from "lucide-react";

export function UserStatsCards({ stats }) {
  const { total, admins, staff, active } = stats;

  const statCards = [
    {
      title: "Total Users",
      value: total,
      icon: Crown,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Admins",
      value: admins,
      icon: Shield,
      iconColor: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Staff",
      value: staff,
      icon: UserCheck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: active,
      icon: UserCheck,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card
            key={card.title}
            className="bg-white/80 backdrop-blur-sm border-0"
          >
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    {card.title}
                  </p>
                  <p className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 truncate">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 p-1.5 sm:p-2 lg:p-3 ${card.bgColor} rounded-lg`}
                >
                  <IconComponent
                    className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 ${card.iconColor}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
