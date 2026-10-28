import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Droplets,
  Flame,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SkinMetrics } from '../types';
import { SKIN_PRESETS } from '../data/mockData';

interface SkinDiagnosticsProps {
  metrics: SkinMetrics;
  onUpdateMetrics: (newMetrics: SkinMetrics) => void;
  onNavigateToTryOn: () => void;
  onNavigateToRecommendations: () => void;
}

export const SkinDiagnostics: React.FC<SkinDiagnosticsProps> = ({
  metrics,
  onUpdateMetrics,
  onNavigateToTryOn,
  onNavigateToRecommendations,
}) => {
  const [selectedPreset, setSelectedPreset] = useState('sensitive_dry');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const found = SKIN_PRESETS.find((p) => p.name === presetName);
    if (found) {
      setIsAnalyzing(true);
      setTimeout(() => {
        onUpdateMetrics(found.metrics);
        setIsAnalyzing(false);
      }, 350);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        onUpdateMetrics({
          ...metrics,
          hydration: Math.floor(Math.random() * 25) + 40,
          redness: Math.floor(Math.random() * 20) + 45,
          overallHealthScore: Math.floor(Math.random() * 15) + 75,
        });
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#1C1917] flex items-center gap-2">
            <span>Clinical Skin AI Diagnostics & Radar</span>
            <span className="text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#EAE4DC] text-[#78350F] border border-[#D8D1C5]">
              YouCam Core Standard
            </span>
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Real-time biometric assessment of 7 dermatological indicators and biological skin age estimation.
          </p>
        </div>

        {/* Diagnostic Preset Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EAE4DC] border border-[#D8D1C5] rounded-xl shrink-0">
          <span className="text-[11px] font-semibold text-stone-600 px-2">Presets:</span>
          {SKIN_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSelectPreset(p.name)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPreset === p.name
                  ? 'bg-[#1C1917] text-white shadow-xs'
                  : 'text-stone-700 hover:text-black'
              }`}
            >
              {p.label.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#D8D1C5] shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Overall Vitality Score</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-numbers text-[#1C1917]">
              {metrics.overallHealthScore}
            </span>
            <span className="text-xs text-stone-500 font-mono-numbers">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-emerald-800 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Skin Type: {metrics.skinType}</span>
          </div>
        </div>

        {/* Skin Age vs Chronological */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#D8D1C5] shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Skin Age Biological Index</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-numbers text-[#C2611C]">
              {metrics.skinAge}
            </span>
            <span className="text-xs text-stone-500 font-medium">yrs</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Chronological: {metrics.chronologicalAge} yrs</span>
          </div>
        </div>

        {/* Hydration */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#D8D1C5] shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Epidermal Moisture Level</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-numbers text-sky-700">
              {metrics.hydration}%
            </span>
          </div>
          <div className="mt-2">
            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
              {metrics.hydration < 50 ? 'Dehydrated Barrier' : 'Optimal Moisture'}
            </span>
          </div>
        </div>

        {/* Redness / Erythema */}
        <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#D8D1C5] shadow-xs">
          <div className="text-xs text-stone-500 font-medium">Cheek Vascular Erythema</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-numbers text-[#C2593F]">
              {metrics.redness}%
            </span>
          </div>
          <div className="mt-2">
            <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              {metrics.redness > 50 ? 'Elevated Erythema' : 'Calm & Uniform'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Facial Scan Preview */}
        <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl p-5 border border-[#D8D1C5] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E0D6]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Active Biometric Target
            </span>
            <span className="text-xs font-mono-numbers text-stone-500">
              4096 Landmark Mesh
            </span>
          </div>

          <div className="relative mt-4 aspect-square rounded-xl overflow-hidden bg-stone-100 border border-[#D8D1C5] group">
            <img
              src="/src/assets/images/model_front_view_1793112138563.jpg"
              alt="Diagnostic Facial Model"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 pointer-events-none border border-stone-400/30 m-4 rounded-lg">
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-white/95 text-[#1C1917] text-[10px] font-semibold rounded border border-[#D8D1C5] shadow-xs">
                T-Zone Moisture: {metrics.hydration}%
              </div>
              <div className="absolute top-24 left-4 px-2 py-0.5 bg-white/95 text-[#C2593F] text-[10px] font-semibold rounded border border-[#D8D1C5] shadow-xs">
                Erythema: {metrics.redness}%
              </div>
              <div className="absolute top-20 right-4 px-2 py-0.5 bg-white/95 text-[#B45309] text-[10px] font-semibold rounded border border-[#D8D1C5] shadow-xs">
                Periorbital: {metrics.darkCircles}%
              </div>
            </div>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-stone-200 border-t-[#1C1917] rounded-full animate-spin" />
                <span className="text-xs font-semibold text-[#1C1917]">
                  Scanning facial biometrics...
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-[#D8D1C5] hover:bg-[#F2ECE4] rounded-lg text-xs font-semibold text-stone-700 transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-stone-600" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => {
                setIsAnalyzing(true);
                setTimeout(() => setIsAnalyzing(false), 800);
              }}
              className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1C1917] hover:bg-stone-800 rounded-lg text-xs font-semibold text-white transition-all shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Recalibrate</span>
            </button>
          </div>
        </div>

        {/* Right: Detailed Metric Scores */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#D8D1C5] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6]">
              <h3 className="text-base font-semibold text-[#1C1917]">
                Detailed Diagnostic Metrics Breakdown
              </h3>
              <span className="text-xs text-stone-500">
                Calibrated against 100-pt clinical scale
              </span>
            </div>

            <div className="space-y-4 mt-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-stone-700">1. Deep Epidermal Hydration</span>
                  <span className="font-mono-numbers font-semibold text-sky-800">
                    {metrics.hydration} / 100
                  </span>
                </div>
                <div className="w-full bg-[#EAE4DC] rounded-full h-2 overflow-hidden border border-[#D8D1C5]">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: `${metrics.hydration}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-stone-700">2. Erythema & Vascular Redness</span>
                  <span className="font-mono-numbers font-semibold text-[#C2593F]">
                    {metrics.redness} / 100
                  </span>
                </div>
                <div className="w-full bg-[#EAE4DC] rounded-full h-2 overflow-hidden border border-[#D8D1C5]">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-[#C2593F] h-2 rounded-full"
                    style={{ width: `${metrics.redness}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-stone-700">3. Fine Lines & Expression Wrinkles</span>
                  <span className="font-mono-numbers font-semibold text-amber-800">
                    {metrics.wrinkles} / 100
                  </span>
                </div>
                <div className="w-full bg-[#EAE4DC] rounded-full h-2 overflow-hidden border border-[#D8D1C5]">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${metrics.wrinkles}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-stone-700">4. Periorbital Dark Circles</span>
                  <span className="font-mono-numbers font-semibold text-stone-800">
                    {metrics.darkCircles} / 100
                  </span>
                </div>
                <div className="w-full bg-[#EAE4DC] rounded-full h-2 overflow-hidden border border-[#D8D1C5]">
                  <div
                    className="bg-stone-500 h-2 rounded-full"
                    style={{ width: `${metrics.darkCircles}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-stone-700">5. Pore Visibility & Micro-Texture</span>
                  <span className="font-mono-numbers font-semibold text-stone-700">
                    {metrics.pores} / 100
                  </span>
                </div>
                <div className="w-full bg-[#EAE4DC] rounded-full h-2 overflow-hidden border border-[#D8D1C5]">
                  <div
                    className="bg-stone-400 h-2 rounded-full"
                    style={{ width: `${metrics.pores}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Diagnostic Primary Concerns */}
            <div className="mt-6 p-4 bg-white border border-[#D8D1C5] rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Identified Clinical Priority Targets
              </div>
              <div className="flex flex-wrap gap-2">
                {metrics.primaryConcerns.map((c, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-stone-800 bg-[#FAF7F2] border border-[#D8D1C5] px-3 py-1 rounded-md shadow-2xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Cross-navigation CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-4 border-t border-[#E6E0D6]">
              <button
                onClick={onNavigateToTryOn}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C1917] hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <span>Preview 360° Try-On</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateToRecommendations}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D8D1C5] hover:bg-white text-stone-800 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
              >
                <span>View Regimen Recommendations</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
