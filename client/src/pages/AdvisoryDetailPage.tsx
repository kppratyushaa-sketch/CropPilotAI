import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { AdvisoryResultCard } from '../components/AdvisoryResultCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { AdvisoryRecord } from '../schemas/farmInputSchema';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';

export const AdvisoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [advisory, setAdvisory] = useState<AdvisoryRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvisory = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const response = await api.get<{ success: boolean; advisory: AdvisoryRecord }>(
        `/advisories/${id}`,
        token
      );

      if (response && response.advisory) {
        setAdvisory(response.advisory);
      } else {
        throw new Error('Advisory not found.');
      }
    } catch (err: any) {
      console.error('[Fetch Advisory Detail Error]:', err);
      setError(
        err.message || 'Unable to retrieve this crop advisory. It may not exist or belongs to another account.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Retrieving your crop advisory..." subMessage="Fetching precision parameters and AI modeling" />
      </div>
    );
  }

  if (error || !advisory) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-6 flex items-start space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Advisory Lookup Notice</p>
            <p className="mt-1 text-xs">{error || 'Advisory not found'}</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>

          <button
            onClick={fetchAdvisory}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 print:hidden">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Advisory Dashboard</span>
        </Link>
      </div>

      <AdvisoryResultCard advisory={advisory} />
    </div>
  );
};
