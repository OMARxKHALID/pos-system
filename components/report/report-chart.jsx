"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ReportChart = () => {
  return (
    <Card className="border bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Sales Analytics</h3>
          <Select defaultValue="total-sales">
            <SelectTrigger className="w-56 h-10 text-sm border-slate-200 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total-sales">Total Sales Amount</SelectItem>
              <SelectItem value="total-products">
                Total Product Sales
              </SelectItem>
              <SelectItem value="total-customers">Total Customers</SelectItem>
              <SelectItem value="net-profit">Net Profit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced Chart Area */}
        <div className="relative mb-6 overflow-hidden border h-80 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl border-slate-200/30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <svg className="w-full h-full" viewBox="0 0 500 300">
            <defs>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            <g stroke="#e2e8f0" strokeWidth="1" opacity="0.3">
              {[60, 120, 180, 240].map((y) => (
                <line key={y} x1="40" y1={y} x2="460" y2={y} />
              ))}
            </g>

            {/* Chart line */}
            <path
              d="M 40 220 Q 100 180 150 190 T 250 160 T 350 170 T 450 140"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
            />

            {/* Chart area */}
            <path
              d="M 40 220 Q 100 180 150 190 T 250 160 T 350 170 T 450 140 L 450 280 L 40 280 Z"
              fill="url(#chartGradient)"
            />

            {/* Data points */}
            {[
              { x: 40, y: 220 },
              { x: 150, y: 190 },
              { x: 250, y: 160 },
              { x: 350, y: 170 },
              { x: 450, y: 140 },
            ].map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="3"
                className="drop-shadow-lg"
              />
            ))}
          </svg>
        </div>

        {/* Enhanced Chart Stats */}
        <div className="grid grid-cols-3 gap-8">
          <div className="p-4 text-center border bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-blue-200/30">
            <p className="mb-2 text-sm font-medium text-slate-600">
              Total Amount
            </p>
            <p className="mb-1 text-2xl font-bold text-slate-800">$12,650.00</p>
            <p className="text-xs font-medium text-blue-600">USD</p>
          </div>
          <div className="p-4 text-center border bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border-emerald-200/30">
            <p className="mb-2 text-sm font-medium text-slate-600">Growth</p>
            <p className="mb-1 text-2xl font-bold text-emerald-600">
              +$1,543.30
            </p>
            <p className="text-xs font-medium text-emerald-600">USD</p>
          </div>
          <div className="p-4 text-center border bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border-purple-200/30">
            <p className="mb-2 text-sm font-medium text-slate-600">
              Growth Rate
            </p>
            <p className="mb-1 text-2xl font-bold text-purple-600">↑ 12.2%</p>
            <p className="text-xs font-medium text-purple-600">Percent</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
