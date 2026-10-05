import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  ArrowRight,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Bug,
  Sparkles,
  MapPin
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/40 via-white to-slate-50">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-400/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-800 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Democratizing Expert Agronomic Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              AI-Powered Precision <br />
              <span className="bg-gradient-to-r from-brand-700 via-emerald-600 to-harvest-600 bg-clip-text text-transparent">
                Crop Advisory Assistant
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Input localized environmental constraints—soil type, pH, season, and acreage. Receive structured, data-backed crop selection, irrigation schedules, and disease risk assessments powered by Google Gemini AI.
            </p>

            {/* Call To Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to={user ? "/advisory/new" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all cursor-pointer group"
              >
                <span>{user ? "Generate New Advisory" : "Start Free Advisory Plan"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to={user ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <span>{user ? "Open Dashboard" : "Sign In to Farm Account"}</span>
              </Link>
            </div>

            {/* Quick Metrics / Guarantees */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Strict Zod Schema Validation</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>PostgreSQL Row-Level Security</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Offline Field PDF Export</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Teaser Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="bg-slate-900 px-6 py-3.5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-300 ml-2">CropPilot Intelligence Engine v1.0</span>
              </div>
              <span className="text-xs text-brand-400 font-mono flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Live Sample Analysis</span>
              </span>
            </div>

            <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Region</span>
                  <p className="text-sm font-semibold text-slate-800 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>Punjab, India</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Soil & pH</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Loamy (pH 6.8)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Water & Season</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">Moderate / Monsoon</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Farm Scale</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">25.0 Acres</p>
                </div>
              </div>

              {/* Sample Output Mini-Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-brand-200 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm">
                      #1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Basmati Rice (Pusa 1121)</h4>
                      <p className="text-xs text-slate-500">Projected Yield: 22-25 Quintals/Acre</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-emerald-700">96% Viability</div>
                      <div className="text-[10px] text-slate-400">Optimum soil match</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                      High Yield
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                      #2
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Soybean (JS 335)</h4>
                      <p className="text-xs text-slate-500">Projected Yield: 10-12 Quintals/Acre</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-emerald-700">89% Viability</div>
                      <div className="text-[10px] text-slate-400">Low water demand</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                      Balanced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Agronomic Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Scientific Agriculture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            4-Pillar Comprehensive Advisory Framework
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Every analysis from CropPilot AI synthesizes data across all key dimensions necessary for a successful harvest cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Crop Viability Matrix</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates expected yield per acre and viability scores (1-100) specifically calibrated to soil structure and climate.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Irrigation Scheduling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prescriptive drip vs flood water schedules aligned to local water availability, preventing root rot and groundwater depletion.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Fertilizer & NPK Balance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nitrogen, Phosphorus, Potassium (NPK) ratios corrected for exact soil pH to guarantee nutrient uptake and maximize soil fertility.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Pest & Disease Forecaster</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Early warning intelligence outlining seasonal microbial and insect risks with actionable preventive organic treatments.
            </p>
          </div>
        </div>
      </section>

      {/* Production Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              Production Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
              Built on Modern Full-Stack & Generative AI Standards
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Zero mock data. End-to-end security via Supabase JWT authorization, row-level security on PostgreSQL, and Google Gen AI structured JSON response schemas.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors"
              >
                <span>Experience CropPilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
