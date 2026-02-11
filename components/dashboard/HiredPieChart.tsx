"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface HiredPieChartProps {
  hired: number;
  notHired: number;
}

export function HiredPieChart({ hired, notHired }: HiredPieChartProps) {
  const data = [
    { name: "Hired", value: hired },
    { name: "Not Hired", value: notHired },
  ];

  const COLORS = ["#10b981", "#e2e8f0"];

  const total = hired + notHired;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 h-full w-full flex flex-col outline-none" tabIndex={-1}>
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Hiring Overview
      </h3>
      <div className="flex-1 min-h-[200px] [&_*]:outline-none">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-slate-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No applicants yet
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-emerald-600">{hired}</p>
          <p className="text-xs text-slate-500">Hired</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-400">{notHired}</p>
          <p className="text-xs text-slate-500">Not Hired</p>
        </div>
      </div>
    </div>
  );
}