"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyData {
  week: string;
  applicants: number;
}

interface ApplicantsChartProps {
  data: WeeklyData[];
}

export function ApplicantsChart({ data }: ApplicantsChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full w-full outline-none" tabIndex={-1}>
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Weekly Applicants
      </h3>
      <div className="h-64 [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2269e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2269e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: 600, color: "#1e293b" }}
            />
            <Area
              type="monotone"
              dataKey="applicants"
              stroke="#2269e9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorApplicants)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}