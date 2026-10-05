import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { DashboardStats } from '../components/DashboardStats';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { AdvisoryRecord } from '../schemas/farmInputSchema';
import {
  PlusCircle,
  Search,
  RefreshCw,
  ArrowRight,
  Sprout,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile, getToken } = useAuth();
  const [advisories, setAdvisories] = useState<AdvisoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoil, setSelectedSoil] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');

  const fetchAdvisories = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMessage(null);

    try {
      const token = await getToken();
      const response = await api.get<{ success: boolean; advisories: AdvisoryRecord[] }>(
        '/advisories',
        token
      );

      if (response && response.advisories) {
        setAdvisories(response.advisories);
      }
    } catch (err: any) {
      console.warn('Advisory fetch notice:', err.message);
      setErrorMessage(
        err.message || 'Unable to connect to the CropPilot backend API. Ensure server is running.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Farmer Planner';

  // Filtered advisories list
  const filteredAdvisories = advisories.filter((adv) => {
    const locMatch = (adv.farm_inputs?.location || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const soilMatch =
      selectedSoil === 'ALL' || adv.farm_inputs?.soilType === selectedSoil;

    const seasonMatch =
      selectedSeason === 'ALL' ||
      (adv.farm_inputs?.season || '').toLowerCase().includes(selectedSeason.toLowerCase());

    return locMatch && soilMatch && seasonMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {displayName}
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Active Session
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review historical soil evaluations, crop viability matrices, and generate new farm advisories.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchAdvisories(true)}
            disabled={refreshing}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <Link
            to="/advisory/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-600/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Advisory</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats advisories={advisories} />

      {/* Backend / API Notice Alert if server is offline or tables empty */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-slate-900">Backend Communication Status:</span> {errorMessage}
            <p className="mt-1 text-slate-500">
              When ready, start the Node backend using <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm run dev</code> inside <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">/server</code>.
            </p>
          </div>
        </div>
      )}

      {/* Advisory Explorer Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <h2 className="text-base font-bold text-slate-900">Historical Crop Advisories</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
              {filteredAdvisories.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by farm location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-800"
              />
            </div>

            {/* Soil Filter */}
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              <option value="ALL">All Soils</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Loamy">Loamy</option>
              <option value="Peat">Peat</option>
              <option value="Chalky">Chalky</option>
            </select>

            {/* Season Filter */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-slate-700"
            >
              <option value="ALL">All Seasons</option>
              <option value="summer">Summer</option>
              <option value="monsoon">Monsoon</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-16">
            <LoadingSpinner message="Retrieving your advisory history..." />
          </div>
        ) : filteredAdvisories.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 border border-brand-100 shadow-xs">
              <Sprout className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Advisories Found</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {advisories.length === 0
                ? "You haven't generated any AI crop advisories yet. Input your farm soil, pH, and water availability to get your first tailored plan."
                : "No advisories match your current search filters. Try clearing the filter parameters."}
            </p>
            <div className="mt-5">
              <Link
                to="/advisory/new"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Your First Advisory</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Advisories Table / Grid */
          <div className="divide-y divide-slate-200">
            {filteredAdvisories.map((advisory) => {
              const inputs = advisory.farm_inputs;
              const crops = advisory.ai_recommendation?.recommendedCrops || [];

              return (
                <div
                  key={advisory.id}
                  className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{inputs?.location || 'Unknown Location'}</span>
                      </span>

                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {inputs?.farmSizeAcres} Acres
                      </span>

                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 rounded-md">
                        {inputs?.soilType} (pH {inputs?.soilPH})
                      </span>

                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-800 rounded-md">
                        {inputs?.season}
                      </span>
                    </div>

                    {/* Recommended Crops Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-slate-500 font-medium">Recommended:</span>
                      {crops.slice(0, 3).map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded-full font-medium"
                        >
                          {c.cropName} {c.viabilityScore ? `(${c.viabilityScore}%)` : ''}
                        </span>
                      ))}
                      {crops.length > 3 && (
                        <span className="text-xs text-slate-400">+{crops.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right text-xs text-slate-400 hidden sm:block">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(advisory.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/advisory/${advisory.id}`}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
                    >
                      <span>View Advisory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
