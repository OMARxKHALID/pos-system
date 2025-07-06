import ReportGraph from "./report-graph";
import FavoriteProducts from "./favorite-products";

export function DashboardCharts({ data }) {
  // Ensure data exists and provide fallbacks
  const safeData = data || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart with Earnings Cards */}
      <div className="space-y-6">
        <ReportGraph
          data={safeData.revenueData || []}
          todaySales={safeData.todaySales || 0}
          yesterdaySales={safeData.yesterdaySales || 0}
        />
      </div>

      <FavoriteProducts
        products={safeData.topProducts || []}
        search=""
        setSearch={() => {}}
      />
    </div>
  );
}
