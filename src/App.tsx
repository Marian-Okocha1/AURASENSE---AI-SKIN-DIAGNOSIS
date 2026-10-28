/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, SkinMetrics, VTOState, ProductItem, LanguageOption, SkinProfile, UserBodyProfile } from './types';
import { INITIAL_SKIN_METRICS, INITIAL_SKIN_PROFILE, INITIAL_BODY_PROFILE, PRODUCTS_CATALOG, SKIN_PRESETS } from './data/mockData';
import { LANGUAGES } from './data/languages';
import { Navbar } from './components/Navbar';
import { LeftPanelInputVoice } from './components/LeftPanelInputVoice';
import { MiddlePanelTryOn } from './components/MiddlePanelTryOn';
import { RightPanelEcommerceRadar } from './components/RightPanelEcommerceRadar';
import { VirtualTryOn360 } from './components/VirtualTryOn360';
import { Recommendations } from './components/Recommendations';
import { ReportSection } from './components/ReportSection';
import { CartDrawer } from './components/CartDrawer';
import { Sparkles, X, Activity, Eye, FileText, ShoppingBag, Mic, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('diagnostics');
  const [mobileDiagnosticsPanel, setMobileDiagnosticsPanel] = useState<'tryon' | 'intake' | 'diagnostics' | 'all'>('tryon');
  const [voiceContext, setVoiceContext] = useState<string>(
    'Attending an outdoor evening wedding, experiencing dry cheeks and mild redness.'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [skinMetrics, setSkinMetrics] = useState<SkinMetrics>(INITIAL_SKIN_METRICS);
  const [skinProfile, setSkinProfile] = useState<SkinProfile>(INITIAL_SKIN_PROFILE);
  const [bodyProfile, setBodyProfile] = useState<UserBodyProfile>(INITIAL_BODY_PROFILE);
  const [activePresetName, setActivePresetName] = useState<string>('sensitive_dry');
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);

  // Floating Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Virtual Try-On State: BOTH Eyes AND Lips enabled & merged simultaneously by default
  const [vtoState, setVtoState] = useState<VTOState>({
    angle: 0,
    isRotating: false,
    rotationSpeed: 1,
    zoomLevel: 1.0,
    panOffset: { x: 0, y: 0 },
    hapticsEnabled: true,
    activeFocusRegion: 'all',
    viewMode: 'fullBody',
    bodyFocusRegion: 'silhouette',
    selectedApparelId: 'apparel-wrap-gown',
    selectedApparelColor: '#C2593F',
    selectedApparelSize: 'M',
    showBodyFitOverlay: true,
    showGarmentTexture: true,
    showLipColor: true,
    lipstickShade: '#9E3248', // Velvet Berry
    lipstickOpacity: 85,
    showEyeMakeup: true,
    eyeMakeupColor: '#5A382E', // Warm Bronze
    eyeMakeupOpacity: 75,
    showBlush: true,
    blushTone: '#F49D85', // Peach Blossom
    blushOpacity: 70,
    foundationFinish: 'dewy',
    showHydrationHeatmap: false,
    showRednessReduction: false,
    showTextureSmoothing: true,
    compareMode: false,
  });

  // Shopping Bag State
  const [cartItems, setCartItems] = useState<{ product: ProductItem; quantity: number }[]>([
    { product: PRODUCTS_CATALOG[0], quantity: 1 },
    { product: PRODUCTS_CATALOG[2], quantity: 1 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleUpdateVTO = (updates: Partial<VTOState>) => {
    setVtoState((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectPreset = (presetName: string) => {
    setActivePresetName(presetName);
    const found = SKIN_PRESETS.find((p) => p.name === presetName);
    if (found) {
      setSkinMetrics(found.metrics);
      showToast(`Skin profile set to ${found.label}`);
    }
  };

  const handleImageUploaded = (imgUrl: string) => {
    setUserUploadedImage(imgUrl);
    showToast('Facial photo uploaded successfully. Calibrating landmarks...');
    setSkinMetrics((prev) => ({
      ...prev,
      overallHealthScore: Math.floor(Math.random() * 15) + 76,
      hydration: Math.floor(Math.random() * 25) + 42,
    }));
  };

  const handleAddToCart = (product: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to your bag.`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: ProductItem; quantity: number }[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleTryShadeIn360 = (shadeHex: string) => {
    setVtoState((prev) => ({
      ...prev,
      lipstickShade: shadeHex,
      showLipColor: true,
      compareMode: false,
    }));
    showToast('Applied matched shade to 360° Try-On Viewer.');
  };

  const handleApplyContextToDiagnostics = () => {
    const lower = voiceContext.toLowerCase();
    let updatedMetrics = { ...skinMetrics };

    if (
      lower.includes('dry') ||
      lower.includes('winter') ||
      lower.includes('déshydratée') ||
      lower.includes('جفاف') ||
      lower.includes('wow') ||
      lower.includes('bushewa')
    ) {
      updatedMetrics.hydration = Math.max(28, updatedMetrics.hydration - 12);
      if (!updatedMetrics.primaryConcerns.includes('Dehydration & Barrier Repair')) {
        updatedMetrics.primaryConcerns = [
          'Dehydration & Barrier Repair',
          ...updatedMetrics.primaryConcerns.slice(0, 2),
        ];
      }
    }
    if (
      lower.includes('red') ||
      lower.includes('rojeces') ||
      lower.includes('sensible') ||
      lower.includes('xonq') ||
      lower.includes('pupa')
    ) {
      updatedMetrics.redness = Math.min(88, updatedMetrics.redness + 14);
    }
    if (
      lower.includes('wedding') ||
      lower.includes('gala') ||
      lower.includes('soirée') ||
      lower.includes('party') ||
      lower.includes('ngente')
    ) {
      setVtoState((prev) => ({ ...prev, foundationFinish: 'dewy', lipstickOpacity: 90 }));
    }

    setSkinMetrics(updatedMetrics);
    showToast('AI Regimen adapted according to your voice context.');
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111827] via-[#172033] to-[#1f2937] text-[#F9FAFB] flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 pb-28 md:pb-8">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1f2937] border border-[#374151] text-[#F9FAFB] shadow-2xl animate-fade-in backdrop-blur-md max-w-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3-Panel Hero Dashboard (Primary E-Commerce Architecture) */}
        {activeTab === 'diagnostics' && (
          <div>
            {/* Mobile Viewport Segmented Panel Switcher */}
            <div className="lg:hidden mb-4 p-1.5 bg-[#161f2e] border border-[#374151] rounded-2xl flex items-center gap-1 shadow-md overflow-x-auto no-scrollbar">
              <button
                onClick={() => setMobileDiagnosticsPanel('tryon')}
                className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                  mobileDiagnosticsPanel === 'tryon'
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-cyan-300" />
                <span>360° Try-On</span>
              </button>
              <button
                onClick={() => setMobileDiagnosticsPanel('intake')}
                className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                  mobileDiagnosticsPanel === 'intake'
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5 text-cyan-300" />
                <span>Intake & Voice</span>
              </button>
              <button
                onClick={() => setMobileDiagnosticsPanel('diagnostics')}
                className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                  mobileDiagnosticsPanel === 'diagnostics'
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-300" />
                <span>Biometrics & Bag</span>
              </button>
              <button
                onClick={() => setMobileDiagnosticsPanel('all')}
                className={`min-h-[42px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shrink-0 transition-all ${
                  mobileDiagnosticsPanel === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="View all 3 panels vertically"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 1. Left Panel (Input & Voice) */}
              <div className={`lg:col-span-3 ${mobileDiagnosticsPanel === 'intake' || mobileDiagnosticsPanel === 'all' ? 'block' : 'hidden lg:block'}`}>
                <LeftPanelInputVoice
                  voiceContext={voiceContext}
                  onVoiceChange={setVoiceContext}
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={setSelectedLanguage}
                  onApplyContext={handleApplyContextToDiagnostics}
                  onImageUploaded={handleImageUploaded}
                  onSelectPreset={handleSelectPreset}
                  activePresetName={activePresetName}
                />
              </div>

              {/* 2. Middle Panel (Live Preview / Try-On with Full Body & Face) */}
              <div className={`lg:col-span-5 ${mobileDiagnosticsPanel === 'tryon' || mobileDiagnosticsPanel === 'all' ? 'block' : 'hidden lg:block'}`}>
                <MiddlePanelTryOn
                  vtoState={vtoState}
                  onUpdateVTO={handleUpdateVTO}
                  userUploadedImage={userUploadedImage}
                  bodyProfile={bodyProfile}
                  onAddToCart={handleAddToCart}
                  onReturnToDashboard={() => setActiveTab('diagnostics')}
                  onOpenFullStudio={() => setActiveTab('tryon360')}
                />
              </div>

              {/* 3. Right Panel (E-Commerce & Diagnostics Radar) */}
              <div className={`lg:col-span-4 ${mobileDiagnosticsPanel === 'diagnostics' || mobileDiagnosticsPanel === 'all' ? 'block' : 'hidden lg:block'}`}>
                <RightPanelEcommerceRadar
                  metrics={skinMetrics}
                  skinProfile={skinProfile}
                  bodyProfile={bodyProfile}
                  onUpdateSkinProfile={(updated) => {
                    setSkinProfile(updated);
                    setSkinMetrics((prev) => ({
                      ...prev,
                      hydration: updated.hydration,
                      redness: updated.redness,
                      wrinkles: updated.wrinkles,
                      overallHealthScore: updated.overallHealthScore,
                    }));
                    showToast(`Updated phototype to Type ${updated.fitzpatrickScale} (${updated.fitzpatrickName})`);
                  }}
                  onUpdateBodyProfile={(updated) => {
                    setBodyProfile(updated);
                    showToast(`Calibrated body contour to ${updated.bodyShape} Silhouette`);
                  }}
                  onAddToCart={handleAddToCart}
                  onTryShadeIn360={handleTryShadeIn360}
                  onOpenReport={() => setActiveTab('report')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dedicated Expanded Views */}
        {activeTab === 'tryon360' && (
          <div className="studio-card rounded-3xl p-4 sm:p-6 border border-[#374151] shadow-xl bg-[#1f2937] text-[#F9FAFB]">
            <VirtualTryOn360
              vtoState={vtoState}
              skinProfile={skinProfile}
              bodyProfile={bodyProfile}
              onUpdateVTO={handleUpdateVTO}
              onSelectProductForVTO={handleTryShadeIn360}
              onReturnToDashboard={() => setActiveTab('diagnostics')}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="studio-card rounded-3xl p-4 sm:p-6 border border-[#374151] shadow-xl bg-[#1f2937] text-[#F9FAFB]">
            <Recommendations
              metrics={skinMetrics}
              skinProfile={skinProfile}
              bodyProfile={bodyProfile}
              voiceContext={voiceContext}
              onAddToCart={handleAddToCart}
              onTryShadeIn360={handleTryShadeIn360}
              onNavigateToReport={() => setActiveTab('report')}
              onReturnToDashboard={() => setActiveTab('diagnostics')}
              onTryApparelIn360={(apparelId) => {
                setVtoState((prev) => ({
                  ...prev,
                  viewMode: 'fullBody',
                  selectedApparelId: apparelId,
                }));
                setActiveTab('tryon360');
              }}
            />
          </div>
        )}

        {activeTab === 'report' && (
          <div className="studio-card rounded-3xl p-4 sm:p-6 border border-[#374151] shadow-xl bg-[#1f2937] text-[#F9FAFB]">
            <ReportSection
              metrics={skinMetrics}
              skinProfile={skinProfile}
              bodyProfile={bodyProfile}
              voiceContext={voiceContext}
              selectedLanguage={selectedLanguage}
              onReturnToDashboard={() => setActiveTab('diagnostics')}
            />
          </div>
        )}
      </main>

      {/* Slide-over Consultation Bag / Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      {/* Mobile Bottom Navigation Bar (Thumb-Accessible for Phones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-lg border-t border-[#374151] px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'diagnostics' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('tryon360')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'tryon360' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>360° Try-On</span>
        </button>
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'recommendations' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Regimen</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'report' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Report</span>
        </button>
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-semibold min-w-[56px] min-h-[48px] text-slate-400 hover:text-white relative transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-cyan-300" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>
      </nav>

      {/* Fashion Studio Editorial Footer */}
      <footer className="border-t border-[#374151] bg-[#111827] py-6 text-xs text-slate-400">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F9FAFB] font-serif">AuraSense</span>
            <span>·</span>
            <span>Agentic AI Beauty & Skincare Personal Shopper</span>
          </div>
          <div className="text-slate-300 flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>YouCam Skin AI & Virtual Try-On Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
