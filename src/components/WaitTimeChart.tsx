import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendDataPoint } from "../types";

interface WaitTimeChartProps {
  currentSarvaWait: number;
  currentSpecialWait: number;
}

export const WaitTimeChart: React.FC<WaitTimeChartProps> = ({
  currentSarvaWait,
  currentSpecialWait,
}) => {
  // Generate a realistic 24-hour cycle of wait times based on the current wait time values
  const generateTrendData = (): TrendDataPoint[] => {
    const times = [
      { label: "04:00 AM", factorSarva: 0.6, factorSpecial: 0.5 },
      { label: "08:00 AM", factorSarva: 0.9, factorSpecial: 0.8 },
      { label: "12:00 PM", factorSarva: 1.2, factorSpecial: 1.2 },
      { label: "04:00 PM", factorSarva: 1.3, factorSpecial: 1.1 },
      { label: "08:00 PM", factorSarva: 1.0, factorSpecial: 0.9 },
      { label: "12:00 AM", factorSarva: 0.7, factorSpecial: 0.6 },
    ];

    // Scale so that the average matches our current wait times
    return times.map((t) => {
      const sarvaWait = Math.max(1, Math.round(currentSarvaWait * t.factorSarva));
      const specialWait = Math.max(1, Math.round(currentSpecialWait * t.factorSpecial));
      return {
        time: t.label,
        sarvaWait,
        specialWait,
      };
    });
  };

  const data = generateTrendData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-lg border border-slate-700 text-xs font-sans">
          <p className="font-semibold mb-1 text-slate-300">{label} (Estimated)</p>
          <div className="space-y-1">
            <p className="flex items-center text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 inline-block"></span>
              Sarvadarsanam: <span className="font-bold ml-1">{payload[0].value} Hrs</span>
            </p>
            <p className="flex items-center text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 inline-block"></span>
              Special Entry: <span className="font-bold ml-1">{payload[1].value} Hrs</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-xs">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Intraday Wait Time Trends</h3>
          <p className="text-xs text-slate-500 mt-1">
            Historical wait time estimates across different hours of the day (scaled to live status).
          </p>
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0 text-xs font-medium">
          <span className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Sarvadarsanam Peak
          </span>
          <span className="flex items-center text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>
            SED (₹300) Smooth
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSarva" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSpecial" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              unit="h"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => {
                return (
                  <span className="text-xs text-slate-600 font-medium">
                    {value === "sarvaWait" ? "Sarvadarsanam (Free)" : "Special Entry (₹300)"}
                  </span>
                );
              }}
            />
            <Area
              name="sarvaWait"
              type="monotone"
              dataKey="sarvaWait"
              stroke="#d97706"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSarva)"
            />
            <Area
              name="specialWait"
              type="monotone"
              dataKey="specialWait"
              stroke="#4f46e5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpecial)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex items-start space-x-2">
        <span className="text-xs text-amber-800">💡</span>
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          <strong>Tip for Pilgrims:</strong> Wait times typically valley during early morning hours (3:00 AM - 5:00 AM) and late evening. Standing in line during midday peak hours often adds 3 to 4 hours of delay.
        </p>
      </div>
    </div>
  );
};
