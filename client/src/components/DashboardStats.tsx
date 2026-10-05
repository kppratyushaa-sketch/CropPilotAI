import {
  FileText,
  TrendingUp,
  Layers,
  Droplets
} from 'lucide-react';
import type { AdvisoryRecord } from '../schemas/farmInputSchema';

interface DashboardStatsProps {
  advisories: AdvisoryRecord[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ advisories }) => {
  const totalCount = advisories.length;

  const totalAcres = advisories.reduce(
    (sum, adv) => sum + (adv.farm_inputs?.farmSizeAcres || 0),
    0
  );

  // Compute average viability score of recommended crops across advisories
  let totalScore = 0;
  let scoreCount = 0;

  advisories.forEach((adv) => {
    adv.ai_recommendation?.recommendedCrops?.forEach((crop) => {
      if (typeof crop.viabilityScore === 'number') {
        totalScore += crop.viabilityScore;
        scoreCount += 1;
      }
    });
  });

  const avgViability = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

  // Find most frequent soil type
  const soilCounts: Record<string, number> = {};
  advisories.forEach((adv) => {
    const s = adv.farm_inputs?.soilType;
    if (s) soilCounts[s] = (soilCounts[s] || 0) + 1;
  });

  const mostFrequentSoil = Object.entries(soilCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Advisories
          </span>
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">{totalCount}</span>
          <span className="text-xs text-brand-700 font-medium bg-brand-50 px-1.5 py-0.5 rounded">
            {totalCount > 0 ? 'Active' : 'No records yet'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Generated crop recommendations</p>
      </div>

      {/* Metric 2 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Acreage Modeled
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">{totalAcres.toFixed(1)}</span>
          <span className="text-xs text-slate-500 font-medium">Acres</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Total analyzed farmland area</p>
      </div>

      {/* Metric 3 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg. Viability Index
          </span>
          <div className="w-8 h-8 rounded-lg bg-harvest-50 text-harvest-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900">
            {avgViability > 0 ? `${avgViability}%` : '—'}
          </span>
          {avgViability > 0 && (
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              High Match
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">AI recommendation confidence</p>
      </div>

      {/* Metric 4 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Primary Soil Type
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900 truncate">
            {mostFrequentSoil}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Most frequent farm terrain</p>
      </div>
    </div>
  );
};
