import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  Sun,
  Moon,
  FileText,
  RotateCcw,
  Shirt,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SkinMetrics, ProductItem, SkinProfile, UserBodyProfile } from '../types';
import { PRODUCTS_CATALOG, RECOMMENDED_ROUTINES } from '../data/mockData';

interface RecommendationsProps {
  metrics: SkinMetrics;
  skinProfile?: SkinProfile;
  bodyProfile?: UserBodyProfile;
  voiceContext: string;
  onAddToCart: (product: ProductItem) => void;
  onTryShadeIn360: (shadeHex: string) => void;
  onNavigateToReport: () => void;
  onReturnToDashboard?: () => void;
  onTryApparelIn360?: (apparelId: string) => void;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  metrics,
  skinProfile,
  bodyProfile,
  voiceContext,
  onAddToCart,
  onTryShadeIn360,
  onNavigateToReport,
  onReturnToDashboard,
  onTryApparelIn360,
}) => {
  return (
    <div className="space-y-8">
      {/* Header & Agent Reasoning Banner */}
      <div className="bg-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AuraSense Agentic AI Personal Shopper</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-[#F9FAFB] mt-1">
              Biometric Haute Couture & Skincare Regimen
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesized by cross-referencing your live YouCam metrics (Phototype {skinProfile?.fitzpatrickScale || 'III'} · {bodyProfile?.bodyShape || 'Hourglass'} Silhouette) with your event context:{' '}
              <span className="font-semibold text-cyan-300 italic">
                &ldquo;{voiceContext || 'Attending upcoming event, seeking moisture & gentle coverage'}&rdquo;
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onReturnToDashboard && (
              <button
                onClick={onReturnToDashboard}
                className="min-h-[44px] flex items-center gap-2 px-3.5 py-2 bg-[#1f2937] hover:bg-[#374151] text-slate-200 border border-[#374151] rounded-xl text-xs font-semibold transition-all"
              >
                <span>⬅️ Dashboard</span>
              </button>
            )}
            <button
              onClick={onNavigateToReport}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all shrink-0"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Generate Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Agentic Fashion Architecture & Biometric Styling Hook */}
      {bodyProfile && skinProfile && (
        <div className="bg-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#374151]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400">
                <Shirt className="w-4 h-4 text-violet-400" />
                <span>Haute Couture Fit & Color Harmonic Synthesis</span>
              </div>
              <h3 className="text-base font-semibold text-[#F9FAFB] mt-1">
                Custom Tailoring for {bodyProfile.bodyShape} Architecture & Phototype {skinProfile.fitzpatrickScale}
              </h3>
            </div>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/40">
              AI Agent Grounded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Clothing Fit & Flattering Silhouettes */}
            <div className="p-4 rounded-xl bg-[#1f2937] border border-[#374151] shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                01. Architectural Fit Directives
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {bodyProfile.stylingAdvice.clothingFitAdvice}
              </p>
              <div className="pt-2 border-t border-[#374151] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#F9FAFB] block">
                  Recommended Garment Cuts:
                </span>
                {bodyProfile.stylingAdvice.flatteringCuts.map((cut, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{cut}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Phototype Sun & Color Match */}
            <div className="p-4 rounded-xl bg-[#1f2937] border border-[#374151] shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                02. Phototype & Color Palette Harmony
              </span>
              <div className="p-2.5 rounded-lg bg-[#161f2e] border border-[#374151] text-xs text-slate-300 leading-relaxed font-normal">
                <span className="font-semibold text-cyan-300">Phototype Protocol: </span>
                {skinProfile.sunProtectionAdvice}
              </div>
              <div className="space-y-1.5 pt-2 border-t border-[#374151]">
                <span className="text-[11px] font-semibold text-[#F9FAFB] block">
                  Couture Palette (Strict Warm Earth & Neutrals):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {bodyProfile.stylingAdvice.colorPaletteMatches.map((col, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#161f2e] text-slate-200 border border-[#374151]"
                    >
                      {col}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  *Zero pink rule enforced. All selections calibrated in warm cognac, cashmere, and espresso tones.
                </span>
              </div>
            </div>

            {/* Column 3: Curated VTO Try-On Outfits */}
            <div className="p-4 rounded-xl bg-[#1f2937] border border-[#374151] shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                03. Curated VTO Outfits for {bodyProfile.bodyShape}
              </span>
              <div className="space-y-2">
                {bodyProfile.stylingAdvice.vtoTryOnSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#161f2e] border border-[#374151] text-xs text-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold block truncate">{suggestion}</span>
                        <span className="text-[11px] text-slate-400">
                          Tailored for {bodyProfile.bodyShape} silhouette
                        </span>
                      </div>
                    </div>
                    {onTryApparelIn360 && (
                      <button
                        onClick={() => onTryApparelIn360('apparel-wrap-gown')}
                        className="min-h-[32px] px-2.5 py-1 bg-[#1f2937] hover:bg-[#283344] text-cyan-300 border border-[#374151] rounded-md text-[10px] font-bold shrink-0 transition-colors"
                      >
                        360° Try-On
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AM / PM Skincare Routine Steps */}
      <div className="bg-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#374151]">
          <div>
            <h3 className="text-base font-semibold text-[#F9FAFB]">
              Recommended Skincare Routine & Active Formulations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Targeted to repair your lipid barrier and restore moisture equilibrium.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* AM Protocol */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/40 w-fit">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Morning Protocol (AM Defense)</span>
            </div>

            <div className="space-y-3">
              {RECOMMENDED_ROUTINES.filter((r) => r.phase === 'AM').map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-[#374151] bg-[#1f2937] hover:bg-[#283344] transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-[#F9FAFB]">
                      Step {step.stepNumber}: {step.name}
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono-numbers font-medium bg-[#111827] px-2 py-0.5 rounded border border-[#374151]">
                      {step.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {step.instructions}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {step.activeIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-[#111827] text-slate-300 border border-[#374151] px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PM Protocol */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-300 bg-violet-950/40 px-3 py-1.5 rounded-lg border border-violet-500/40 w-fit">
              <Moon className="w-4 h-4 text-violet-400" />
              <span>Evening Protocol (PM Recovery)</span>
            </div>

            <div className="space-y-3">
              {RECOMMENDED_ROUTINES.filter((r) => r.phase === 'PM').map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl border border-[#374151] bg-[#1f2937] hover:bg-[#283344] transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold text-[#F9FAFB]">
                      Step {step.stepNumber}: {step.name}
                    </div>
                    <span className="text-[10px] text-cyan-300 font-mono-numbers font-medium bg-[#111827] px-2 py-0.5 rounded border border-[#374151]">
                      {step.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {step.instructions}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {step.activeIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-[#111827] text-slate-300 border border-[#374151] px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Matched Products Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#F9FAFB]">
              Matched Cosmetics & Clinical Formulations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calibrated shades with instant 360° Try-On capability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS_CATALOG.map((product) => (
            <div
              key={product.id}
              className="bg-[#111827] rounded-2xl p-5 border border-[#374151] hover:border-cyan-500/50 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                {/* Product Image */}
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#1f2937] border border-[#374151] mb-4 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.shadeHex && (
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 bg-[#111827]/90 backdrop-blur-md rounded-lg border border-[#374151] shadow-xs text-xs">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-600"
                        style={{ backgroundColor: product.shadeHex }}
                      />
                      <span className="font-semibold text-slate-200 text-[11px]">
                        {product.shadeName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {product.brand}
                </div>
                <h4 className="text-sm font-semibold text-[#F9FAFB] mt-1 line-clamp-2">
                  {product.name}
                </h4>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 bg-[#161f2e] p-2.5 rounded-lg border border-[#374151]">
                  <span className="font-semibold text-cyan-400">Match Reason: </span>
                  {product.matchReason}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {product.activeIngredients.map((act, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-slate-300 bg-[#1f2937] px-2 py-0.5 rounded border border-[#374151] font-medium"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Actions */}
              <div className="mt-5 pt-4 border-t border-[#374151] flex items-center justify-between gap-2">
                <div className="text-base font-bold font-mono-numbers text-cyan-300">
                  ${product.price.toFixed(2)}
                </div>

                <div className="flex items-center gap-2">
                  {product.shadeHex && (
                    <button
                      onClick={() => onTryShadeIn360(product.shadeHex!)}
                      className="min-h-[36px] flex items-center gap-1 px-3 py-1.5 bg-[#1f2937] hover:bg-[#283344] border border-[#374151] rounded-lg text-xs font-semibold text-cyan-300 transition-colors shadow-sm"
                      title="Apply this exact shade to 360 viewer"
                    >
                      <RotateCcw className="w-3 h-3 text-cyan-400" />
                      <span>Try 360°</span>
                    </button>
                  )}

                  <button
                    onClick={() => onAddToCart(product)}
                    className="min-h-[36px] flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-lg text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
