import React from "react";
import { Clock, Users, ArrowUpRight, ShieldCheck, Footprints } from "lucide-react";
import { DarshanCategory } from "../types";

interface DarshanCardProps {
  title: string;
  categoryKey: "sarvadarsanam" | "specialEntry" | "divyaDarshan";
  data: DarshanCategory & {
    compartmentsFilled?: number;
    crowdStatus?: string;
    slotStatus?: string;
    status?: string;
  };
}

export const DarshanCard: React.FC<DarshanCardProps> = ({ title, categoryKey, data }) => {
  const getCrowdColor = (hours: number) => {
    if (hours >= 16) return { bg: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-600 text-white", label: "Very Heavy" };
    if (hours >= 10) return { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "bg-amber-500 text-white", label: "Heavy" };
    if (hours >= 5) return { bg: "bg-yellow-50 text-yellow-800 border-yellow-200", badge: "bg-yellow-500 text-black", label: "Moderate" };
    return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-600 text-white", label: "Normal" };
  };

  const getCategoryTheme = () => {
    switch (categoryKey) {
      case "sarvadarsanam":
        return {
          icon: <Users className="h-5 w-5 text-amber-600" />,
          accent: "border-t-4 border-t-amber-600",
          subtext: data.compartmentsFilled !== undefined ? `${data.compartmentsFilled} Compartments Filled` : ""
        };
      case "specialEntry":
        return {
          icon: <ShieldCheck className="h-5 w-5 text-indigo-600" />,
          accent: "border-t-4 border-t-indigo-600",
          subtext: data.slotStatus ? `Slot Status: ${data.slotStatus}` : ""
        };
      case "divyaDarshan":
        return {
          icon: <Footprints className="h-5 w-5 text-emerald-600" />,
          accent: "border-t-4 border-t-emerald-600",
          subtext: data.status ? `Footpath Status: ${data.status}` : ""
        };
    }
  };

  const theme = getCategoryTheme();
  const crowd = getCrowdColor(data.waitTimeHours);

  return (
    <div className={`bg-white rounded-xl shadow-xs border border-slate-150 overflow-hidden transition-all duration-300 hover:shadow-md ${theme.accent}`}>
      <div className="p-5">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              {theme.icon}
            </div>
            <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${crowd.bg} border`}>
            {categoryKey === "specialEntry" && data.slotStatus === "Booked" ? "Fully Booked" : crowd.label}
          </span>
        </div>

        {/* Wait Time Display */}
        <div className="my-4 flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-slate-900 tracking-tight">
            {data.waitTimeHours}
          </span>
          <span className="text-slate-500 font-medium text-sm">Hours wait</span>
          
          <div className="flex-1 flex justify-end">
            <span className="flex items-center text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
              <Clock className="h-3 w-3 mr-1 text-slate-400" />
              Est. Queue
            </span>
          </div>
        </div>

        {/* Progress Bar Visualizer */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              data.waitTimeHours >= 16 ? "bg-rose-500" :
              data.waitTimeHours >= 10 ? "bg-amber-500" :
              data.waitTimeHours >= 5 ? "bg-yellow-400" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min((data.waitTimeHours / 24) * 100, 100)}%` }}
          />
        </div>

        {/* Sub-details */}
        {theme.subtext && (
          <div className="flex items-center text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-3">
            <span className="font-semibold text-slate-700 mr-2">Status:</span>
            <span className="font-medium">{theme.subtext}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed min-h-[40px]">
          {data.statusDescription}
        </p>
      </div>

      {/* Footer link style decoration */}
      <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
        <span>Required Dress Code applies</span>
        <span className="font-medium text-slate-400 flex items-center">
          Details <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
