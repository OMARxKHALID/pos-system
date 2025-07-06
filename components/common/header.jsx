"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, ShoppingCart, BarChart3, Store } from "lucide-react";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useCartStore } from "@/hooks/zustand/use-cart-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  HeaderDateTimeSkeleton,
  StatusIndicatorSkeleton,
} from "./header-skeleton";

export function PageHeader({
  title,
  subtitle,
  showCartToggle = false,
  showDashboard = false,
  showPOS = false,
  toggleCart = () => {},
  connectionStatus,
  showDateTime = false,
}) {
  const { orderItems } = useCartStore();
  const router = useRouter();
  const { status } = useSession();
  // Use state for date/time, set after mount
  const [dateString, setDateString] = useState("");
  const [timeString, setTimeString] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const updateDateTime = () => {
      const currentDate = new Date();
      setDateString(
        currentDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
      setTimeString(
        currentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateDateTime();
    // Update time every minute
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleDashboardClick = () => {
    if (status === "authenticated") {
      router.push("/admin/dashboard");
    } else {
      router.push("/admin/login");
    }
  };

  // Determine status based on authentication if not provided
  const displayStatus =
    connectionStatus || (status === "authenticated" ? "online" : "offline");

  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-4">
        <div>
          <h6 className="text-5xl font-semibold text-gray-900 mb-1">{title}</h6>
          {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
        </div>
        {showDateTime &&
          (hasMounted ? (
            <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{dateString}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeString}</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <HeaderDateTimeSkeleton />
            </div>
          ))}
      </div>

      <div className="flex items-center gap-2">
        {status === "loading" ? (
          <StatusIndicatorSkeleton />
        ) : (
          <StatusIndicator status={displayStatus} />
        )}

        {showDashboard && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs bg-white/60 border-gray-200"
            onClick={handleDashboardClick}
          >
            {status === "authenticated" ? (
              <>
                <BarChart3 className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Login</span>
              </>
            )}
          </Button>
        )}

        {showPOS && (
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs bg-white/60 border-gray-200"
            >
              <Store className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">POS</span>
            </Button>
          </Link>
        )}

        {showCartToggle && (
          <Button
            variant="outline"
            size="sm"
            className="relative h-7 px-3 text-xs bg-white/60 border-gray-200"
            onClick={toggleCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[9px] rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg border border-white">
                {totalItems}
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
