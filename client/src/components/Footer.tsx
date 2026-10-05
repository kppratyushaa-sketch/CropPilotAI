import React from 'react';
import { Sprout, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CropPilot<span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering farmers, agronomists, and agricultural planners worldwide with scientific AI crop optimization, data-backed irrigation scheduling, and soil vitality intelligence.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                <span>Gemini AI Engine</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-brand-400" />
                <span>Supabase PostgreSQL + RLS</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Strict Security</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Soil pH & Type Profiling</li>
              <li>Viability Score Matrix</li>
              <li>Precision Drip Scheduling</li>
              <li>NPK Fertilizer Balancer</li>
              <li>Pest & Disease Forecaster</li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Agricultural Standards
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Strictly engineered to follow modern agronomy principles: sustainable yield, zero water wastage, and soil organic conservation.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs text-brand-300 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>System Online & Operational</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CropPilotAI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Engineered with React Vite, Tailwind CSS, Supabase PostgreSQL, and Google Gemini AI.
          </p>
        </div>
      </div>
    </footer>
  );
};
