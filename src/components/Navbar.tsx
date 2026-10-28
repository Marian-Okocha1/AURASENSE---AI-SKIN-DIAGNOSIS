import React from 'react';
import { ActiveTab } from '../types';
import { AuraLogo } from './AuraLogo';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111827]/95 backdrop-blur-md border-b border-[#374151] shadow-lg">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Logo & Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="relative p-1 sm:p-1.5 rounded-xl bg-[#1f2937] border border-[#374151] shadow-md flex items-center justify-center">
            <AuraLogo size={36} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#F9FAFB] font-serif">
                AuraSense
              </span>
              {/* API Configured Badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>API Configured</span>
              </div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-slate-400 -mt-0.5 truncate max-w-[180px] sm:max-w-none">
              Agentic AI Beauty & Skincare Personal Shopper
            </span>
          </div>
        </div>

        {/* Center: Navigation Tabs for Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-[#161f2e] border border-[#374151] rounded-xl shadow-inner">
          <button
            onClick={() => onTabChange('diagnostics')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'diagnostics'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-[#232f42]'
            }`}
          >
            Analysis & Radar
          </button>
          <button
            onClick={() => onTabChange('tryon360')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'tryon360'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-[#232f42]'
            }`}
          >
            Virtual Try-On 360°
          </button>
          <button
            onClick={() => onTabChange('recommendations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'recommendations'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-[#232f42]'
            }`}
          >
            AI Recommendations
          </button>
          <button
            onClick={() => onTabChange('report')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'report'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-[#232f42]'
            }`}
          >
            Clinical Report
          </button>
        </nav>

        {/* Right: Cart/Checkout Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="min-h-[44px] flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 rounded-xl shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            aria-label="Open Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white text-violet-700 text-[11px] font-mono-numbers font-bold flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Top Scrollable Navigation Tabs */}
      <div className="md:hidden border-t border-[#374151] bg-[#161f2e] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange('diagnostics')}
          className={`shrink-0 min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'diagnostics'
              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1f2937]'
          }`}
        >
          Analysis & Radar
        </button>
        <button
          onClick={() => onTabChange('tryon360')}
          className={`shrink-0 min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'tryon360'
              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1f2937]'
          }`}
        >
          Try-On 360°
        </button>
        <button
          onClick={() => onTabChange('recommendations')}
          className={`shrink-0 min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'recommendations'
              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1f2937]'
          }`}
        >
          Recommendations
        </button>
        <button
          onClick={() => onTabChange('report')}
          className={`shrink-0 min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-[#1f2937]'
          }`}
        >
          Report
        </button>
      </div>
    </header>
  );
};
