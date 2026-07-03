import { useState, useEffect } from "react";
import { 
  RefreshCw, 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  MapPin, 
  IndianRupee, 
  Users, 
  Sparkles,
  ExternalLink,
  Milestone
} from "lucide-react";
import { DarshanStatusData } from "./types";
import { DarshanCard } from "./components/DarshanCard";
import { WaitTimeChart } from "./components/WaitTimeChart";
import { CrowdPredictor } from "./components/CrowdPredictor";
import { SrivariAssistant } from "./components/SrivariAssistant";
import { motion } from "motion/react";

export default function App() {
  const [data, setData] = useState<DarshanStatusData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"predictor" | "guidelines">("predictor");
  const [istTime, setIstTime] = useState<string>("");

  // Function to fetch live TTD darshan status from our backend
  const fetchStatus = async (forceMock = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = forceMock ? "/api/darshan-status?mock=true" : "/api/darshan-status";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not retrieve current status.");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch live TTD updates. Rendering dynamic fallbacks.");
    } finally {
      setLoading(false);
    }
  };

  // Sync IST Time Clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const timeStr = new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        });
        setIstTime(timeStr + " IST");
      } catch (e) {
        setIstTime(new Date().toLocaleTimeString() + " Local");
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch TTD status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  const formatPilgrims = (count: number) => {
    if (count >= 100000) {
      return (count / 100000).toFixed(2) + " Lakh";
    }
    return count.toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900 pb-12">
      
      {/* Top Banner Ticker - Live Alerts */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-1.5 sm:space-y-0">
          <div className="flex items-center space-x-1.5">
            <span className="bg-amber-500 text-slate-900 text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider animate-pulse">
              Official link
            </span>
            <span className="text-slate-300">
              Book genuine bookings exclusively on: 
            </span>
            <a 
              href="https://ttdevasthanams.ap.gov.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-400 hover:underline font-semibold flex items-center ml-1"
            >
              ttdevasthanams.ap.gov.in <ExternalLink className="h-2.5 w-2.5 ml-0.5" />
            </a>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 font-mono">
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1 text-slate-500" />
              Srivari Temple Time: <strong className="text-amber-400 font-bold ml-1">{istTime}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-150 py-5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative h-11 w-11 bg-amber-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
              🔱
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Tirumala TTD Darshan Status Dashboard - Desinged by Manojava 
                </h1>
                <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  Srivari Tracker
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                Venkateswara Temple, Tirumala (Chittoor District, Andhra Pradesh)
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fetchStatus(false)}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs py-2 px-3.5 rounded-lg transition-all shadow-xs flex items-center space-x-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Syncing..." : "Sync Live TTD Status"}</span>
            </button>
            <button
              onClick={() => fetchStatus(true)}
              disabled={loading}
              title="Force high-fidelity simulated backup data"
              className="border border-slate-250 bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium text-xs py-2 px-3 rounded-lg transition-all"
            >
              Cached Fallback
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        
        {/* Live Status Indicators Banner */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-600 text-white p-4.5 rounded-xl shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Users className="h-6 w-6 text-amber-200" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-200">
                  Yesterday's Pilgrims
                </span>
                <p className="text-xl font-black mt-0.5">
                  {formatPilgrims(data.stats.yesterdayPilgrims)}
                </p>
                <p className="text-[10px] text-amber-100 mt-0.5">Pilgrims completed holy darshan</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-4.5 rounded-xl shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <IndianRupee className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Yesterday's Srivari Hundi
                </span>
                <p className="text-xl font-black text-amber-400 mt-0.5">
                  ₹ {data.stats.yesterdayHundiCrores} Crore
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Devotional offerings recorded</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 p-4.5 rounded-xl shadow-xs flex items-center space-x-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xl">🥯</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Laddu Prasadam Status
                </span>
                <p className="text-xl font-black text-slate-800 mt-0.5">
                  {data.services.laddu.status}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                  {data.services.laddu.statusDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Error States */}
        {loading && !data && (
          <div className="bg-white border border-slate-150 rounded-xl p-12 text-center shadow-xs flex flex-col items-center justify-center my-6">
            <RefreshCw className="h-10 w-10 text-amber-600 animate-spin mb-4" />
            <h3 className="font-bold text-slate-800 text-base">Retrieving Live TTD Dashboard Details</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
              Querying the official TTD dashboard and aggregating live wait times via Google Search Grounding. This may take up to 10 seconds.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-150 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-800 text-xs">Connection Sync Note</h4>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Dynamic AI Mode Badge */}
        {data && (
          <div className="bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-600">
              <Info className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                Data status: <strong className="text-slate-800">{data.isAiGenerated ? "Aggregated live from web reports" : "Simulated Local Backup State"}</strong>. Last refreshed: <span className="font-mono text-slate-800 font-semibold">{data.lastUpdated}</span>.
              </span>
            </div>
            {data.isAiGenerated && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 self-start sm:self-auto flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Real-time Verified
              </span>
            )}
          </div>
        )}

        {/* Main Dashboard Layout Grid */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN - STATS & TRACKERS (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* core category cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DarshanCard 
                  title="Sarvadarsanam (Free Darshan)" 
                  categoryKey="sarvadarsanam"
                  data={data.darshan.sarvadarsanam} 
                />
                <DarshanCard 
                  title="Special Entry Darshan (₹300)" 
                  categoryKey="specialEntry"
                  data={data.darshan.specialEntry} 
                />
              </div>

              {/* Pedestrian / Divya Darshan Card */}
              <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🚶</span>
                    <h3 className="font-bold text-slate-800 text-sm">Divya Darshan (Pedestrian Paths)</h3>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
                    {data.darshan.divyaDarshan.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 mb-3 bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-black text-slate-900">{data.darshan.divyaDarshan.waitTimeHours}</span>
                    <span className="text-xs text-slate-500 font-medium">Hours wait time</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Includes climbing walk duration + compartment wait
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {data.darshan.divyaDarshan.statusDescription}
                </p>
              </div>

              {/* Hourly Chart */}
              <WaitTimeChart 
                currentSarvaWait={data.darshan.sarvadarsanam.waitTimeHours} 
                currentSpecialWait={data.darshan.specialEntry.waitTimeHours} 
              />

              {/* Additional Services Status Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Kalyanakatta (Tonsure)
                  </span>
                  <div className="flex items-baseline space-x-1.5 my-1">
                    <span className="text-2xl font-black text-slate-800">{data.services.kalyanakatta.waitTimeHours}</span>
                    <span className="text-xs text-slate-500 font-medium">Hours wait</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 my-2">
                    <div 
                      className="bg-amber-500 h-1.5 rounded-full" 
                      style={{ width: `${Math.min((data.services.kalyanakatta.waitTimeHours / 6) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-sm">
                    Queue status: {data.services.kalyanakatta.status}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                     CRO Accommodation Status
                  </span>
                  <div className="text-lg font-black text-slate-800 my-1">
                    {data.services.accommodation.status}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                    {data.services.accommodation.statusDescription}
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN - ANNOUNCEMENTS, PREDICTOR & AI CHAT (5 COLS) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Announcements / Ticker Area */}
              <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-5 shadow-xs">
                <div className="flex items-center space-x-2 mb-3 text-amber-800">
                  <span className="text-base">📢</span>
                  <h3 className="font-bold text-sm tracking-wide">TTD Official Updates & Releases</h3>
                </div>
                <ul className="space-y-3.5">
                  {data.recentAnnouncements.map((ann, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs">
                      <span className="text-amber-600 shrink-0 mt-0.5">🔹</span>
                      <span className="text-slate-700 leading-relaxed font-medium">{ann}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Module Tabs: Predictor vs Guidelines */}
              <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs">
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => setActiveTab("predictor")}
                    className={`flex-1 py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 ${
                      activeTab === "predictor"
                        ? "border-amber-600 text-amber-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Crowd Predictor</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("guidelines")}
                    className={`flex-1 py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center justify-center space-x-1.5 ${
                      activeTab === "guidelines"
                        ? "border-amber-600 text-amber-700 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                    }`}
                  >
                    <Milestone className="h-4 w-4" />
                    <span>Essential Guidelines</span>
                  </button>
                </div>

                <div className="p-1">
                  {activeTab === "predictor" ? (
                    <CrowdPredictor />
                  ) : (
                    <div className="p-5 space-y-4 text-xs leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-800 flex items-center text-xs mb-1.5">
                          <span className="mr-1.5">👕</span> Traditional Dress Code (Mandatory)
                        </h4>
                        <p className="text-slate-600 font-medium">
                          <strong>Male:</strong> Dhoti (Veshti) with shirt, or Kurta Pyjama. Dhoti must have an upper cloth (Angavastram). 
                          <br />
                          <strong>Female:</strong> Saree, Half-Saree, or Chudidar/Salwar Kameez with Dupatta.
                          <br />
                          <span className="text-rose-600 font-semibold mt-0.5 block">Forbidden: Jeans, T-shirts, shorts, skirts, or western-wear.</span>
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <h4 className="font-bold text-slate-800 flex items-center text-xs mb-1.5">
                          <span className="mr-1.5">🆔</span> Identity Proofs Requirements
                        </h4>
                        <p className="text-slate-600 font-medium">
                          All pilgrims must carry the <strong>physical copy</strong> of the Government ID (Aadhaar Card, Voter ID, Passport) used during slot booking. Mobile copies are not accepted at entrance verification.
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <h4 className="font-bold text-slate-800 flex items-center text-xs mb-1.5">
                          <span className="mr-1.5">🚫</span> strictly Prohibited Items
                        </h4>
                        <p className="text-slate-600 font-medium">
                          Mobiles, cameras, iPads, calculators, smartwatches, recording devices, food packets, or plastic water bottles are strictly banned inside temple queue complexes. Use the free storage lockers at Vaikuntam entrance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Srivari AI Chatbot Assistant */}
              <SrivariAssistant />

            </div>

          </div>
        )}

      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 text-center text-xs text-slate-400 border-t border-slate-200/80 pt-6">
        <p className="leading-relaxed max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> This dashboard is an independent helper tool designed for pilgrims' planning convenience. It is not affiliated with, authorized, or endorsed by Tirumala Tirupati Devasthanams (TTD). Actual queue lengths, wait times, and ticket release schedules may vary depending on temple administration, Vaikuntam queue logistics, and sudden festival crowds. Always verify bookings and official notifications directly on the official TTD portal.
        </p>
        <p className="mt-3 font-mono text-[10px] text-slate-400">
          TTD Darshan Status Tracker © 2026 • Powered by Google AI Studio Gemini Grounded Search
        </p>
      </footer>
    </div>
  );
}
