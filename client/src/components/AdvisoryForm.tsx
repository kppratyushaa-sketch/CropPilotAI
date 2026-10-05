import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  farmInputSchema,
  soilTypeEnum,
  waterAvailabilityEnum,
  type FarmInput
} from '../schemas/farmInputSchema';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  MapPin,
  Droplets,
  FlaskConical,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdvisoryForm: React.FC = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors }
  } = useForm<FarmInput>({
    resolver: zodResolver(farmInputSchema),
    mode: 'onBlur',
    defaultValues: {
      location: 'Punjab, India',
      farmSizeAcres: 10,
      season: 'Monsoon',
      soilType: 'Loamy',
      soilPH: 6.8,
      waterAvailability: 'Moderate'
    }
  });

  const formValues = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof FarmInput)[] = [];
    if (step === 1) {
      fieldsToValidate = ['location', 'farmSizeAcres', 'season'];
    } else if (step === 2) {
      fieldsToValidate = ['soilType', 'soilPH', 'waterAvailability'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FarmInput) => {
    setSubmitting(true);
    setApiError(null);

    try {
      const token = await getToken();
      const response = await api.post<{
        success: boolean;
        advisoryId: string;
        message: string;
      }>('/advisories', data, token);

      if (response && response.advisoryId) {
        navigate(`/advisory/${response.advisoryId}`);
      } else {
        throw new Error('Backend did not return an advisory ID.');
      }
    } catch (err: any) {
      console.error('[Advisory Submission Error]:', err);
      setApiError(
        err.message || 'Failed to generate advisory. Please check your backend connection and Gemini API key.'
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Agricultural Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-brand-600 via-emerald-500 to-harvest-500" />

      {/* Progress Steps Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Step 1 */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step >= 1 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Land & Climate
            </span>
          </div>

          <div className={`h-0.5 w-12 sm:w-16 ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step >= 2 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Soil Chemistry
            </span>
          </div>

          <div className={`h-0.5 w-12 sm:w-16 ${step >= 3 ? 'bg-brand-600' : 'bg-slate-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 3
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-semibold hidden sm:inline ${
                step === 3 ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              Confirm & Run
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-xs text-rose-700">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-800">Advisory Generation Issue</p>
            <p className="mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-10 space-y-6">
        {/* Step 1: Land & Climate */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <span>Geographic Location & Scale</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide regional context to help Gemini calibrate temperature, weather patterns, and local crop feasibility.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Farm Location / Region <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Punjab, India or Midwest, US"
                {...register('location')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all"
              />
              {errors.location && (
                <p className="text-xs text-rose-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Farm Acreage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Farm Size (Acres) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 15.5"
                  {...register('farmSizeAcres', { valueAsNumber: true })}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Acres
                </span>
              </div>
              {errors.farmSizeAcres && (
                <p className="text-xs text-rose-600 mt-1">{errors.farmSizeAcres.message}</p>
              )}
            </div>

            {/* Season */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Upcoming Season <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Monsoon, Summer, Winter, Rabi, Kharif"
                {...register('season')}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all"
              />
              {errors.season && (
                <p className="text-xs text-rose-600 mt-1">{errors.season.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Soil Chemistry & Water Access */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FlaskConical className="w-5 h-5 text-brand-600" />
                <span>Soil Properties & Environmental Factors</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Soil structure and pH directly dictate nutrient assimilation, water retention, and fertilizer dosage.
              </p>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Soil Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {soilTypeEnum.map((st) => (
                  <label
                    key={st}
                    className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${
                      formValues.soilType === st
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value={st}
                      {...register('soilType')}
                      className="sr-only"
                    />
                    <span className="text-xs block">{st}</span>
                  </label>
                ))}
              </div>
              {errors.soilType && (
                <p className="text-xs text-rose-600 mt-1">{errors.soilType.message}</p>
              )}
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Soil pH Level (1.0 - 14.0) <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-bold text-brand-700 px-2 py-0.5 rounded bg-brand-50">
                  pH {formValues.soilPH || '—'} (
                  {formValues.soilPH < 6.0
                    ? 'Acidic'
                    : formValues.soilPH > 7.5
                    ? 'Alkaline'
                    : 'Optimal / Neutral'}
                  )
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="14.0"
                placeholder="6.5"
                {...register('soilPH', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800 transition-all"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1.0 (Highly Acidic)</span>
                <span>7.0 (Neutral)</span>
                <span>14.0 (Highly Alkaline)</span>
              </div>
              {errors.soilPH && (
                <p className="text-xs text-rose-600 mt-1">{errors.soilPH.message}</p>
              )}
            </div>

            {/* Water Availability */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Water Availability <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {waterAvailabilityEnum.map((wa) => (
                  <label
                    key={wa}
                    className={`cursor-pointer border rounded-xl p-3.5 text-center transition-all ${
                      formValues.waterAvailability === wa
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      value={wa}
                      {...register('waterAvailability')}
                      className="sr-only"
                    />
                    <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <span className="text-xs block">{wa}</span>
                  </label>
                ))}
              </div>
              {errors.waterAvailability && (
                <p className="text-xs text-rose-600 mt-1">{errors.waterAvailability.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Review & Run Confirmation */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span>Verify Agricultural Parameters</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your parameters will be processed by Google Gemini AI and stored under your secure Supabase account.
              </p>
            </div>

            {/* Parameter Review Summary Box */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Location</span>
                  <p className="font-bold text-slate-800 mt-0.5">{formValues.location}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Acreage</span>
                  <p className="font-bold text-slate-800 mt-0.5">{formValues.farmSizeAcres} Acres</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Upcoming Season</span>
                  <p className="font-bold text-slate-800 mt-0.5">{formValues.season}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Soil Type & pH</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {formValues.soilType} (pH {formValues.soilPH})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Water Access</span>
                  <p className="font-bold text-slate-800 mt-0.5">{formValues.waterAvailability}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px]">Engine</span>
                  <p className="font-bold text-brand-700 mt-0.5">Gemini 2.5 Flash GenAI</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200/80 text-xs text-brand-900 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Ready for AI Synthesis</p>
                <p className="mt-0.5 text-brand-800">
                  Clicking "Synthesize AI Crop Advisory" will query Gemini using strict JSON schema modeling and create a permanent record.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={submitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-600/25 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Crop Advisory...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize AI Crop Advisory</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
