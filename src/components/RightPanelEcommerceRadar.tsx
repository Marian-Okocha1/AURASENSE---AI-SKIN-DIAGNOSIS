import React from 'react';
import {
  Droplets,
  Flame,
  Clock,
  ShoppingBag,
  RotateCcw,
  FileText,
  ShieldAlert,
  UserCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SkinMetrics, ProductItem, SkinProfile, UserBodyProfile, FitzpatrickScale } from '../types';
import { PRODUCTS_CATALOG, FITZPATRICK_PRESETS, BODY_SHAPE_PRESETS, parseYouCamBodyResponse } from '../data/mockData';

interface RightPanelEcommerceRadarProps {
  metrics: SkinMetrics;
  skinProfile?: SkinProfile;
  bodyProfile?: UserBodyProfile;
  onUpdateSkinProfile?: (updated: SkinProfile) => void;
  onUpdateBodyProfile?: (updated: UserBodyProfile) => void;
  onAddToCart: (product: ProductItem) => void;
  onTryShadeIn360: (shadeHex: string) => void;
  onOpenReport: () => void;
}

export const RightPanelEcommerceRadar: React.FC<RightPanelEcommerceRadarProps> = ({
  metrics,
  skinProfile,
  bodyProfile,
  onUpdateSkinProfile,
  onUpdateBodyProfile,
  onAddToCart,
  onTryShadeIn360,
  onOpenReport,
}) => {
  const currentFitz = skinProfile?.fitzpatrickScale || 'III';
  const currentShape = bodyProfile?.bodyShape || 'Hourglass';
  const attrs = bodyProfile?.attributes;

  const handleSelectFitzScale = (scale: FitzpatrickScale) => {
    if (!onUpdateSkinProfile || !skinProfile) return;
    const found = FITZPATRICK_PRESETS.find((f) => f.scale === scale);
    if (found) {
      onUpdateSkinProfile({
        ...skinProfile,
        fitzpatrickScale: scale,
        fitzpatrickName: found.name,
        sunProtectionAdvice: found.advice,
        recommendedSPF: found.spf,
        melaninLevel: found.melanin,
        uvSensitivity: found.uv,
      });
    }
  };

  const handleSelectBodyPreset = (presetName: string) => {
    if (!onUpdateBodyProfile) return;
    const found = BODY_SHAPE_PRESETS.find((p) => p.name === presetName);
    if (found) {
      const parsed = parseYouCamBodyResponse(found.payload);
      onUpdateBodyProfile(parsed);
    }
  };

  return (
    <div className="studio-card rounded-2xl p-5 flex flex-col gap-5 border border-[#374151] shadow-xl bg-[#1f2937] text-[#F9FAFB]">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400/50" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
            03. Diagnostics & E-Commerce Matches
          </h3>
        </div>
        <button
          onClick={onOpenReport}
          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Report (.MD/.JSON)</span>
        </button>
      </div>

      {/* Live YouCam Fitzpatrick Scale & Sun-Protection Advice Card */}
      {skinProfile && (
        <div className="p-4 rounded-xl bg-[#111827] border border-[#374151] shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  YouCam Skin Analyzer · Phototype
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#F9FAFB] mt-0.5">
                {skinProfile.fitzpatrickName}
              </h4>
            </div>
            <span className="text-xs font-bold font-mono-numbers text-white bg-gradient-to-r from-cyan-500 to-violet-600 px-2.5 py-1 rounded-md shrink-0 shadow-sm">
              Type {skinProfile.fitzpatrickScale}
            </span>
          </div>

          {/* Clinical Sun Protection Advice */}
          <div className="p-2.5 rounded-lg bg-[#161f2e] border border-[#374151] text-xs text-slate-300 leading-relaxed font-normal">
            <span className="font-semibold text-cyan-300">Sun Protection Directive: </span>
            {skinProfile.sunProtectionAdvice}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-[#161f2e] border border-[#374151]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Recommended</span>
              <span className="font-bold text-cyan-300 font-mono-numbers">SPF {skinProfile.recommendedSPF}+</span>
            </div>
            <div className="p-2 rounded-lg bg-[#161f2e] border border-[#374151]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">UV Sensitivity</span>
              <span className="font-bold text-amber-300">{skinProfile.uvSensitivity}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#161f2e] border border-[#374151]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Melanin Level</span>
              <span className="font-bold text-violet-300">{skinProfile.melaninLevel}</span>
            </div>
          </div>

          {/* Quick Fitzpatrick Selector Pills */}
          <div className="pt-2 border-t border-[#374151]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Simulate API Phototype:</span>
              <span className="text-slate-500 text-[10px]">I (Fair) → VI (Deep)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['I', 'II', 'III', 'IV', 'V', 'VI'] as FitzpatrickScale[]).map((scale) => (
                <button
                  key={scale}
                  onClick={() => handleSelectFitzScale(scale)}
                  className={`min-h-[36px] px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                    currentFitz === scale
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border border-[#374151] hover:border-cyan-500/50'
                  }`}
                >
                  Type {scale}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live YouCam Body Shape & Attribute Flags Verification Card */}
      {bodyProfile && (
        <div className="p-4 rounded-xl bg-[#111827] border border-[#374151] shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-violet-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  YouCam Body Analyzer · Architecture
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#F9FAFB] mt-0.5">
                {bodyProfile.bodyShape} Silhouette
              </h4>
            </div>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md shrink-0">
              Verified Contour
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {bodyProfile.stylingAdvice.silhouette}
          </p>

          {/* Attribute Flags Verification Badges */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Active Attribute Flags (API Payload):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {attrs && (
                <>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.waist
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.waist ? '✓ Waist Cinch' : '· Waist'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.hip
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.hip ? '✓ Hip Curvature' : '· Hip'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.slim
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.slim ? '✓ Slim Frame' : '· Slim'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.leg
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.leg ? '✓ Elongated Leg' : '· Leg'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.taller
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.taller ? '✓ Taller Line' : '· Taller'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.shoulder_left || attrs.shoulder_right
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.shoulder_left || attrs.shoulder_right ? '✓ Sculpted Shoulders' : '· Shoulders'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                      attrs.belly
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#111827] text-slate-500 border-[#374151]'
                    }`}
                  >
                    {attrs.belly ? '✓ Midsection' : '· Midsection'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Body Presets */}
          <div className="pt-2 border-t border-[#374151]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
              <span>Simulate Live Body Payloads:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {BODY_SHAPE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectBodyPreset(preset.name)}
                  className={`min-h-[36px] px-2 py-1 text-[11px] rounded-md font-semibold truncate transition-all text-left ${
                    currentShape.toLowerCase().includes(preset.name.replace('_', ' '))
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border border-[#374151] hover:border-cyan-500/50'
                  }`}
                >
                  {preset.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skin Diagnostics Radar & Metric Scorecards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            Biometric Skin Metrics
          </span>
          <span className="text-xs font-mono-numbers text-cyan-300 font-bold bg-[#111827] px-2.5 py-0.5 rounded-md border border-[#374151]">
            Vitality: {metrics.overallHealthScore}/100
          </span>
        </div>

        {/* 3 Key Metric Score Bars */}
        <div className="space-y-2.5">
          {/* Hydration */}
          <div className="p-3 rounded-xl bg-[#111827] border border-[#374151] shadow-sm">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hydration Level</span>
              </span>
              <span className="font-mono-numbers font-bold text-cyan-400">
                {metrics.hydration}%
              </span>
            </div>
            <div className="w-full bg-[#1f2937] rounded-full h-2 overflow-hidden border border-[#374151]">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.hydration}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
              {metrics.hydration < 50 ? 'Dehydrated · Ceramide barrier repair needed' : 'Optimal moisture equilibrium'}
            </span>
          </div>

          {/* Redness / Erythema */}
          <div className="p-3 rounded-xl bg-[#111827] border border-[#374151] shadow-sm">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Redness / Erythema</span>
              </span>
              <span className="font-mono-numbers font-bold text-rose-400">
                {metrics.redness}%
              </span>
            </div>
            <div className="w-full bg-[#1f2937] rounded-full h-2 overflow-hidden border border-[#374151]">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.redness}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
              {metrics.redness > 50 ? 'Elevated cheek sensitivity · Centella indicated' : 'Calm & balanced epidermal barrier'}
            </span>
          </div>

          {/* Wrinkles / Fine Lines */}
          <div className="p-3 rounded-xl bg-[#111827] border border-[#374151] shadow-sm">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                <span>Wrinkles & Skin Age</span>
              </span>
              <span className="font-mono-numbers font-bold text-violet-300">
                {metrics.skinAge} yrs (Actual: {metrics.chronologicalAge})
              </span>
            </div>
            <div className="w-full bg-[#1f2937] rounded-full h-2 overflow-hidden border border-[#374151]">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.wrinkles}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1.5 block font-medium">
              Fine line resilience in periorbital and nasolabial folds
            </span>
          </div>
        </div>
      </div>

      {/* Recommended E-Commerce Product Checkout Cards */}
      <div className="pt-2 border-t border-[#374151] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#F9FAFB]">
            Matched Regimen Formulations
          </span>
          <span className="text-[11px] text-slate-400 font-mono-numbers font-medium">
            {PRODUCTS_CATALOG.length} Items Available
          </span>
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {PRODUCTS_CATALOG.map((product) => (
            <div
              key={product.id}
              className="p-3 rounded-xl bg-[#111827] border border-[#374151] hover:border-cyan-500/50 transition-all flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-[#1f2937] border border-[#374151] shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 line-clamp-1">
                    {product.brand}
                  </div>
                  <h4 className="text-xs font-semibold text-[#F9FAFB] truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold font-mono-numbers text-cyan-300">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.shadeHex && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-600"
                          style={{ backgroundColor: product.shadeHex }}
                        />
                        <span>{product.shadeName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Match Reason snippet */}
              <p className="text-[11px] text-slate-300 line-clamp-1 font-medium bg-[#161f2e] px-2 py-1 rounded border border-[#374151]">
                <span className="text-cyan-400 font-semibold">Match: </span>
                {product.matchReason}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#374151]">
                {product.shadeHex && (
                  <button
                    onClick={() => onTryShadeIn360(product.shadeHex!)}
                    className="min-h-[36px] flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-cyan-300 hover:text-white bg-[#1f2937] hover:bg-[#283344] border border-[#374151] transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Try Shade</span>
                  </button>
                )}

                <button
                  onClick={() => onAddToCart(product)}
                  className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
