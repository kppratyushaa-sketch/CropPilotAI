import {
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Printer,
  Calendar,
  MapPin,
  ShieldAlert,
  Download
} from 'lucide-react';
import type { AdvisoryRecord } from '../schemas/farmInputSchema';

interface AdvisoryResultCardProps {
  advisory: AdvisoryRecord;
}

export const AdvisoryResultCard: React.FC<AdvisoryResultCardProps> = ({ advisory }) => {
  const { farm_inputs: inputs, ai_recommendation: ai, created_at } = advisory;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(advisory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `croppilot-advisory-${advisory.id.slice(0, 8)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-brand-700 bg-brand-50 border-brand-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 print:p-0">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            CropPilot Intelligence Report
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Agronomic Advisory #{advisory.id.slice(0, 8)}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Generated on{' '}
              {new Date(created_at).toLocaleDateString(undefined, {
                dateStyle: 'full',
              })}
            </span>
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-600/25 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Field PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden print:shadow-none print:border-none">
        {/* Banner Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">CropPilot AI Field Advisory</h2>
                <p className="text-xs text-brand-300">
                  Precision Crop Selection, Hydration & Nutrition Plan
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-300 font-mono">
              <div>Advisory ID: {advisory.id}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Status: Verified by Agronomy AI Engine
              </div>
            </div>
          </div>

          {/* Environmental Parameter Grid */}
          <div className="mt-6 pt-6 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Location</span>
              <p className="font-bold text-white mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-brand-400" />
                <span>{inputs.location}</span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Farm Size</span>
              <p className="font-bold text-white mt-0.5">{inputs.farmSizeAcres} Acres</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Soil Type & pH</span>
              <p className="font-bold text-white mt-0.5">
                {inputs.soilType} • pH {inputs.soilPH}
              </p>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-semibold">Season & Water</span>
              <p className="font-bold text-white mt-0.5">
                {inputs.season} • {inputs.waterAvailability}
              </p>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 sm:p-10 space-y-10">
          {/* Section 1: Recommended Crops */}
          <div>
            <div className="flex items-center space-x-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  High-Yield Crop Recommendations
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrated for {inputs.soilType} soil at pH {inputs.soilPH} during {inputs.season}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ai.recommendedCrops?.map((crop, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-400">Rank #{idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreColor(
                          crop.viabilityScore
                        )}`}
                      >
                        {crop.viabilityScore}% Viability
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{crop.cropName}</h4>

                    <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200/70 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                        Expected Yield
                      </span>
                      <p className="font-bold text-slate-800 mt-0.5">{crop.expectedYieldPerAcre}</p>
                    </div>
                  </div>

                  {/* Viability Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Agronomic Match</span>
                      <span>{crop.viabilityScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, crop.viabilityScore))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Irrigation Schedule */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>Irrigation & Water Management Plan</span>
                  <Droplets className="w-4 h-4 text-blue-500" />
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted delivery based on {inputs.waterAvailability} water availability
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/70 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {ai.irrigationPlan}
            </div>
          </div>

          {/* Section 3: Fertilizer & Soil Nutrition */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>Fertilizer & NPK Soil Nutrition Strategy</span>
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                </h3>
                <p className="text-xs text-slate-500">
                  Nutrient bioavailability adjusted for soil pH of {inputs.soilPH}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {ai.fertilizerRecommendation}
            </div>
          </div>

          {/* Section 4: Pest & Disease Risks */}
          <div>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                  <span>Seasonal Disease & Pest Risk Mitigation</span>
                  <Bug className="w-4 h-4 text-rose-500" />
                </h3>
                <p className="text-xs text-slate-500">
                  Anticipated environmental threats for {inputs.season} season
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ai.diseaseRisks?.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 flex items-start space-x-3 text-xs text-slate-800"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">{risk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info for print */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>
            CropPilot AI • Generated via Google Gemini AI & Supabase Database • For agricultural
            planning purposes. Always inspect field conditions.
          </p>
        </div>
      </div>
    </div>
  );
};
