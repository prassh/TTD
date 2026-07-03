import React, { useState } from "react";
import { Calculator, Calendar, HelpCircle, Flame, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const CrowdPredictor: React.FC = () => {
  const [day, setDay] = useState<string>("Saturday");
  const [season, setSeason] = useState<string>("summer"); // summer, normal, festival, monsoon
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<any>(null);

  const daysList = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const seasonsList = [
    { value: "normal", label: "Normal Off-Peak Week" },
    { value: "summer", label: "Summer/School Holidays (May-June)" },
    { value: "festival", label: "Religious Festivals (Brahmotsavam, Ekadasi)" },
    { value: "monsoon", label: "Monsoon / Rainy Season (Nov-Dec)" }
  ];

  const handlePredict = () => {
    setIsCalculating(true);
    
    // Simulate minor calculation delay for an authentic feeling
    setTimeout(() => {
      let baseSarva = 12;
      let baseSpecial = 3;
      let crowdMultiplier = 1.0;
      let density = "Moderate";
      let colorClass = "text-amber-500";
      let bgClass = "bg-amber-50 border-amber-100";
      let sliderPercent = 50;
      let recommendation = "";

      // Day adjustment
      if (day === "Saturday" || day === "Sunday") {
        baseSarva += 6;
        baseSpecial += 1.5;
        crowdMultiplier += 0.4;
      } else if (day === "Friday" || day === "Monday") {
        baseSarva += 3;
        baseSpecial += 0.5;
        crowdMultiplier += 0.15;
      } else {
        baseSarva -= 2;
        baseSpecial -= 0.5;
        crowdMultiplier -= 0.15;
      }

      // Season adjustment
      if (season === "summer") {
        baseSarva += 8;
        baseSpecial += 2;
        crowdMultiplier += 0.4;
      } else if (season === "festival") {
        baseSarva += 18;
        baseSpecial += 4;
        crowdMultiplier += 0.9;
      } else if (season === "monsoon") {
        baseSarva -= 1;
        baseSpecial -= 0.2;
        crowdMultiplier -= 0.1;
      }

      const finalSarva = Math.round(baseSarva);
      const finalSpecial = Math.round(baseSpecial);

      // Determine density category
      if (finalSarva >= 24) {
        density = "Extreme";
        colorClass = "text-rose-600";
        bgClass = "bg-rose-50 border-rose-150";
        sliderPercent = 95;
        recommendation = "Highly crowded. Recommended to avoid Sarvadarsanam if travelling with infants, pregnant women, or senior citizens. Ensure you carry water and dry snacks for wait halls.";
      } else if (finalSarva >= 16) {
        density = "Very Heavy";
        colorClass = "text-orange-600";
        bgClass = "bg-orange-50 border-orange-100";
        sliderPercent = 80;
        recommendation = "Heavy pilgrim influx. Expect high wait times in Vaikuntam compartments. Ensure you pre-book Special Entry Darshan (₹300) to complete visit within 4-5 hours.";
      } else if (finalSarva >= 10) {
        density = "Moderate to Heavy";
        colorClass = "text-amber-600";
        bgClass = "bg-amber-50 border-amber-100";
        sliderPercent = 60;
        recommendation = "Standard weekend/vacation crowds. Ensure traditional dress code is ready and report 1 hour prior to your slot time.";
      } else {
        density = "Normal / Light";
        colorClass = "text-emerald-600";
        bgClass = "bg-emerald-50 border-emerald-100";
        sliderPercent = 30;
        recommendation = "Ideal travel window! Wait times are minimal and darshan queue moves swiftly. CRO direct room allotments in Tirumala are also easier to acquire.";
      }

      setPrediction({
        sarvaWait: finalSarva,
        specialWait: finalSpecial,
        density,
        colorClass,
        bgClass,
        sliderPercent,
        recommendation
      });
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-xs h-full">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="h-5 w-5 text-amber-600" />
        <h3 className="font-bold text-slate-800 text-base">Darshan Crowd Predictor</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Select a day and travel period to estimate crowd levels, queue compartments, and get specialized planning advice.
      </p>

      {/* Select Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Day of the Week
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {daysList.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDay(d)}
                className={`py-1.5 px-1 rounded text-xs font-medium border transition-all text-center ${
                  day === d
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Travel Period / Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
          >
            {seasonsList.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handlePredict}
        disabled={isCalculating}
        className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
      >
        <span>{isCalculating ? "Calculating Status..." : "Run Crowd Prediction"}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Prediction Output */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 border-t border-slate-100 pt-5"
        >
          {/* Density Indicator Slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-500">Predicted Density:</span>
              <span className={`font-bold uppercase ${prediction.colorClass} flex items-center`}>
                <Flame className="h-3.5 w-3.5 mr-1" />
                {prediction.density}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full relative overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  prediction.density === "Extreme" ? "bg-rose-600" :
                  prediction.density === "Very Heavy" ? "bg-orange-500" :
                  prediction.density === "Moderate to Heavy" ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${prediction.sliderPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Light</span>
              <span>Moderate</span>
              <span>Heavy</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Times Breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Sarvadarsanam (Free)
              </span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                {prediction.sarvaWait} <span className="text-xs font-medium text-slate-500">Hrs</span>
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Special Entry (₹300)
              </span>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                {prediction.specialWait} <span className="text-xs font-medium text-slate-500">Hrs</span>
              </p>
            </div>
          </div>

          {/* Custom Advice */}
          <div className={`p-3 rounded-lg border text-xs leading-relaxed ${prediction.bgClass}`}>
            <div className="flex items-center space-x-1.5 mb-1 text-slate-800 font-bold">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Srivari Pilgrim Guidance:</span>
            </div>
            <span className="text-slate-600 font-medium">{prediction.recommendation}</span>
          </div>
        </motion.div>
      )}

      {!prediction && (
        <div className="mt-8 border border-dashed border-slate-200 rounded-lg p-5 text-center flex flex-col items-center justify-center h-[210px]">
          <Calendar className="h-8 w-8 text-slate-300 mb-2" />
          <span className="text-xs text-slate-400 font-medium leading-relaxed">
            Configure target week specifications and click "Run Prediction" to view tailored guidance.
          </span>
        </div>
      )}
    </div>
  );
};
