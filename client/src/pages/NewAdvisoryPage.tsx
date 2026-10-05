import React from 'react';
import { AdvisoryForm } from '../components/AdvisoryForm';
import { Sprout } from 'lucide-react';

export const NewAdvisoryPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-semibold mb-3">
          <Sprout className="w-3.5 h-3.5" />
          <span>Agricultural Input Calibration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Generate Precision Crop Advisory
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
          Enter localized soil chemistry, seasonal timing, and water access to receive AI-driven agronomist recommendations.
        </p>
      </div>

      <AdvisoryForm />
    </div>
  );
};
