import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Eye,
  Check,
  ZoomIn,
  ZoomOut,
  Vibrate,
  Film,
  Crosshair,
  Shirt,
  Ruler,
  ShoppingBag,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import {
  VTOState,
  FocusRegion,
  BodyFocusRegion,
  UserBodyProfile,
  ProductItem,
  ApparelItem,
} from '../types';
import {
  MODEL_ANGLES,
  FULL_BODY_MODEL_ANGLES,
  VTO_SHADES,
  APPAREL_CATALOG,
  getGarmentColorFilter,
} from '../data/mockData';
import { AnimateVideoModal } from './AnimateVideoModal';

interface MiddlePanelTryOnProps {
  vtoState: VTOState;
  onUpdateVTO: (updates: Partial<VTOState>) => void;
  userUploadedImage?: string | null;
  bodyProfile?: UserBodyProfile;
  onAddToCart?: (product: ProductItem) => void;
  onReturnToDashboard?: () => void;
  onOpenFullStudio?: () => void;
}

export const MiddlePanelTryOn: React.FC<MiddlePanelTryOnProps> = ({
  vtoState,
  onUpdateVTO,
  userUploadedImage,
  bodyProfile,
  onAddToCart,
  onOpenFullStudio,
}) => {
  const [sliderAngle, setSliderAngle] = useState(vtoState.angle);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hapticRipple, setHapticRipple] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const [isInteracting, setIsInteracting] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'rotate' | 'pan'>('rotate');
  const startPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startAngle = useRef<number>(0);
  const startPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const initialPinchDistance = useRef<number | null>(null);
  const initialPinchZoom = useRef<number>(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (pattern: number | number[] = 15) => {
    if (vtoState.hapticsEnabled) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch (_) {}
      }
      setHapticRipple(true);
      setTimeout(() => setHapticRipple(false), 220);
    }
  };

  useEffect(() => {
    setSliderAngle(vtoState.angle);
  }, [vtoState.angle]);

  // Automated 360 turntable rotation loop
  useEffect(() => {
    let intervalId: any;
    if (vtoState.isRotating) {
      intervalId = setInterval(() => {
        setSliderAngle((prev) => {
          const next = (prev + 1.8 * vtoState.rotationSpeed) % 360;
          onUpdateVTO({ angle: Math.round(next) });
          return next;
        });
      }, 40);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [vtoState.isRotating, vtoState.rotationSpeed, onUpdateVTO]);

  // Selected Apparel Data
  const activeApparelId = vtoState.selectedApparelId || APPAREL_CATALOG[0].id;
  const selectedApparel =
    APPAREL_CATALOG.find((a) => a.id === activeApparelId) || APPAREL_CATALOG[0];
  const apparelColorHex = vtoState.selectedApparelColor || selectedApparel.colorHex;

  // Active Angle Models: Use selected garment's tailored 360 angles if in fullBody mode
  const isFullBodyMode = vtoState.viewMode === 'fullBody';
  const activeAngleSet = isFullBodyMode
    ? selectedApparel.modelAngles || FULL_BODY_MODEL_ANGLES
    : MODEL_ANGLES;

  const getClosestAngleModel = (deg: number) => {
    const normalized = ((deg % 360) + 360) % 360;
    if (normalized >= 337.5 || normalized < 22.5) {
      return activeAngleSet[0];
    } else if (normalized >= 22.5 && normalized < 67.5) {
      return activeAngleSet[1];
    } else if (normalized >= 67.5 && normalized < 135) {
      return activeAngleSet[2];
    } else if (normalized >= 135 && normalized < 225) {
      return activeAngleSet[3];
    } else if (normalized >= 225 && normalized < 292.5) {
      return activeAngleSet[4];
    } else {
      return activeAngleSet[5];
    }
  };

  const currentModel = getClosestAngleModel(sliderAngle);
  const isBackView = currentModel.angle === 180;
  const isProfile90 = currentModel.angle === 90 || currentModel.angle === 270;
  const isProfile45 = currentModel.angle === 45 || currentModel.angle === 315;

  const displayImage =
    !isFullBodyMode && userUploadedImage && sliderAngle === 0
      ? userUploadedImage
      : currentModel.image;

  const userShape = bodyProfile?.bodyShape || 'Hourglass';
  const bodyShapeFit =
    selectedApparel.compatibleBodyShapes.find((s) => s.shape === userShape) ||
    selectedApparel.compatibleBodyShapes[0];

  const eyeColor = vtoState.eyeMakeupColor || '#5A382E';
  const lipColor = vtoState.lipstickShade || '#9E3248';
  const blushColor = vtoState.blushTone || '#F49D85';

  const handleAnglePreset = (
    targetAngle: number,
    zoom: number = 1.0,
    pan: { x: number; y: number } = { x: 0, y: 0 }
  ) => {
    triggerHaptic([15, 30, 15]);
    onUpdateVTO({
      angle: targetAngle,
      zoomLevel: zoom,
      panOffset: pan,
      isRotating: false,
    });
  };

  const adjustZoom = (delta: number) => {
    triggerHaptic(20);
    const newZoom = Math.max(1.0, Math.min(3.5, Number((vtoState.zoomLevel + delta).toFixed(2))));
    onUpdateVTO({
      zoomLevel: newZoom,
      panOffset: newZoom === 1.0 ? { x: 0, y: 0 } : vtoState.panOffset,
    });
  };

  // Full Body Focus Zones
  const handleBodyFocus = (focus: BodyFocusRegion) => {
    triggerHaptic([20, 40]);
    if (focus === 'silhouette') {
      onUpdateVTO({
        bodyFocusRegion: 'silhouette',
        zoomLevel: 1.0,
        panOffset: { x: 0, y: 0 },
      });
    } else if (focus === 'bodice') {
      onUpdateVTO({
        bodyFocusRegion: 'bodice',
        zoomLevel: 1.85,
        panOffset: { x: 0, y: 24 },
      });
    } else if (focus === 'waist') {
      onUpdateVTO({
        bodyFocusRegion: 'waist',
        zoomLevel: 2.2,
        panOffset: { x: 0, y: 3 },
      });
    } else if (focus === 'hemline') {
      onUpdateVTO({
        bodyFocusRegion: 'hemline',
        zoomLevel: 1.7,
        panOffset: { x: 0, y: -26 },
      });
    }
  };

  // Face Region Focus
  const handleFaceRegionFocusAndToggle = (region: FocusRegion) => {
    triggerHaptic([20, 40]);
    if (region === 'all') {
      onUpdateVTO({
        activeFocusRegion: 'all',
        zoomLevel: 1.0,
        panOffset: { x: 0, y: 0 },
      });
    } else if (region === 'eyes') {
      onUpdateVTO({
        activeFocusRegion: 'eyes',
        showEyeMakeup: true,
        zoomLevel: 2.6,
        panOffset: { x: 0, y: 17 },
      });
    } else if (region === 'lips') {
      onUpdateVTO({
        activeFocusRegion: 'lips',
        showLipColor: true,
        zoomLevel: 2.5,
        panOffset: { x: 0, y: -19 },
      });
    } else if (region === 'cheek') {
      onUpdateVTO({
        activeFocusRegion: 'cheek',
        showBlush: true,
        zoomLevel: 2.2,
        panOffset: { x: -14, y: 2 },
      });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
    adjustZoom(zoomDelta);
  };

  const handlePointerDown = (e: React.MouseEvent) => {
    setIsInteracting(true);
    startPointer.current = { x: e.clientX, y: e.clientY };
    startAngle.current = sliderAngle;
    startPan.current = { ...vtoState.panOffset };
    setInteractionMode(vtoState.zoomLevel > 1.2 && !e.shiftKey ? 'pan' : 'rotate');
  };

  const handlePointerMove = (e: React.MouseEvent) => {
    if (!isInteracting) return;
    const deltaX = e.clientX - startPointer.current.x;
    const deltaY = e.clientY - startPointer.current.y;

    if (interactionMode === 'pan') {
      const panFactor = 0.15 / vtoState.zoomLevel;
      const newPanX = Math.max(-40, Math.min(40, startPan.current.x - deltaX * panFactor));
      const newPanY = Math.max(-40, Math.min(40, startPan.current.y - deltaY * panFactor));
      onUpdateVTO({ panOffset: { x: newPanX, y: newPanY } });
    } else {
      let newAngle = (startAngle.current + deltaX * 0.7) % 360;
      if (newAngle < 0) newAngle += 360;
      const rounded = Math.round(newAngle);
      setSliderAngle(rounded);
      onUpdateVTO({ angle: rounded, isRotating: false });

      if (rounded % 45 === 0) {
        triggerHaptic(10);
      }
    }
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialPinchDistance.current = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      initialPinchZoom.current = vtoState.zoomLevel;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      startPointer.current = { x: touch.clientX, y: touch.clientY };
      startAngle.current = sliderAngle;
      startPan.current = { ...vtoState.panOffset };
      setInteractionMode(vtoState.zoomLevel > 1.2 ? 'pan' : 'rotate');
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const scaleDelta = dist / initialPinchDistance.current;
      const newZoom = Math.max(
        1.0,
        Math.min(3.5, Number((initialPinchZoom.current * scaleDelta).toFixed(2)))
      );
      onUpdateVTO({ zoomLevel: newZoom });
      triggerHaptic(10);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - startPointer.current.x;
      const deltaY = touch.clientY - startPointer.current.y;

      if (interactionMode === 'pan') {
        const panFactor = 0.2 / vtoState.zoomLevel;
        const newPanX = Math.max(-40, Math.min(40, startPan.current.x - deltaX * panFactor));
        const newPanY = Math.max(-40, Math.min(40, startPan.current.y - deltaY * panFactor));
        onUpdateVTO({ panOffset: { x: newPanX, y: newPanY } });
      } else {
        let newAngle = (startAngle.current + deltaX * 0.8) % 360;
        if (newAngle < 0) newAngle += 360;
        const rounded = Math.round(newAngle);
        setSliderAngle(rounded);
        onUpdateVTO({ angle: rounded, isRotating: false });
      }
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistance.current = null;
  };

  const handleAddOutfitToBag = (apparel: ApparelItem) => {
    triggerHaptic([30, 60, 30]);
    const size = vtoState.selectedApparelSize || 'M';
    const colorName =
      apparel.availableColors.find((c) => c.hex === apparelColorHex)?.name || apparel.colorName;

    const product: ProductItem = {
      id: `${apparel.id}-${size}-${colorName.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${apparel.name} (${size} · ${colorName})`,
      brand: apparel.brand,
      category: 'Apparel & Styling',
      price: apparel.price,
      rating: apparel.rating,
      reviewsCount: apparel.reviewsCount,
      image: apparel.image,
      description: `${apparel.description} Fabric: ${apparel.fabricType}. Size: ${size}. Color: ${colorName}.`,
      shadeName: colorName,
      shadeHex: apparelColorHex,
      activeIngredients: [apparel.fabricType, `${size} Proportion Fit`, 'Custom Biometric Drape'],
      targetConcerns: ['Silhouette Contouring', 'Occasion Tailoring'],
      matchReason: `Calibrated for ${userShape} silhouette with verified ${bodyShapeFit.matchScore}% body-fit score.`,
      checkoutUrl: `https://aurasense.beauty/checkout?sku=${apparel.id}&size=${size}`,
      bodyFitRationale: `Architecturally engineered for ${userShape} proportions: ${bodyShapeFit.verdict}`,
    };

    if (onAddToCart) {
      onAddToCart(product);
    }
    setAddedToast(`Added "${product.name}" to shopping bag!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const perspectiveRotateY = ((sliderAngle % 45) - 22.5) * 0.4;

  return (
    <div className="bg-[#111827] rounded-3xl p-5 sm:p-6 border border-[#374151] shadow-2xl flex flex-col space-y-4">
      {/* Top Header: View Mode Switcher [Full Body | Face] & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#374151]">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#161f2e] border border-[#374151] rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              triggerHaptic(20);
              onUpdateVTO({ viewMode: 'fullBody', zoomLevel: 1.0, panOffset: { x: 0, y: 0 } });
            }}
            className={`flex-1 sm:flex-initial min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isFullBodyMode
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Full Body 360°</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(20);
              onUpdateVTO({ viewMode: 'face', zoomLevel: 1.0, panOffset: { x: 0, y: 0 } });
            }}
            className={`flex-1 sm:flex-initial min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              !isFullBodyMode
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Face Beauty</span>
          </button>
        </div>

        {/* Live Body Shape Match Indicator */}
        <div className="flex items-center gap-2">
          {isFullBodyMode ? (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Shape:</span>
              <span className="font-bold text-violet-300">{userShape}</span>
              <span className="font-mono-numbers font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px]">
                {bodyShapeFit.matchScore}% Match
              </span>
            </div>
          ) : (
            <span className="text-xs text-cyan-400 font-semibold">
              Lips & Eyes Merged Coherently
            </span>
          )}

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="min-h-[34px] px-2.5 py-1 bg-[#161f2e] hover:bg-[#283344] text-cyan-300 border border-[#374151] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Generate a 5-second animated runway video clip"
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Animate Video</span>
          </button>
        </div>
      </div>

      {/* Added Toast */}
      {addedToast && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-200 text-xs font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Interactive Turntable Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full rounded-2xl overflow-hidden bg-[#0d1524] border border-[#374151] select-none cursor-grab active:cursor-grabbing group flex items-center justify-center shadow-inner ${
          isFullBodyMode ? 'aspect-[3/4] max-h-[520px]' : 'aspect-square max-h-[440px]'
        }`}
        style={{ perspective: '1200px' }}
      >
        {/* Animated Model Canvas */}
        <div
          className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform flex items-center justify-center"
          style={{
            transform: `scale(${vtoState.zoomLevel}) translate(${vtoState.panOffset.x}%, ${vtoState.panOffset.y}%) rotateY(${perspectiveRotateY}deg)`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={displayImage}
            alt={`Virtual Try-On Model ${currentModel.label}`}
            className={`w-full h-full object-cover transition-opacity duration-150 ${
              currentModel.flip ? '-scale-x-100' : ''
            }`}
            style={{
              filter: isFullBodyMode
                ? getGarmentColorFilter(selectedApparel.id, apparelColorHex)
                : undefined,
            }}
            draggable={false}
          />

          {/* FULL BODY APPAREL VIRTUAL TRY-ON OVERLAY */}
          {isFullBodyMode && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Biometric Measurement Guidelines */}
              {vtoState.showBodyFitOverlay && (
                <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200">
                  <div className="absolute top-[21%] left-[28%] right-[28%] flex items-center justify-between border-b border-cyan-400/70 border-dashed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -ml-1" />
                    <span className="text-[9px] font-mono-numbers text-cyan-300 bg-black/75 px-1 py-0.5 rounded -mt-3 border border-cyan-500/40">
                      Shoulders: 39cm
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -mr-1" />
                  </div>

                  <div className="absolute top-[37%] left-[32%] right-[32%] flex items-center justify-between border-b border-violet-400/80 border-dashed">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 -ml-1" />
                    <span className="text-[9px] font-mono-numbers text-violet-300 bg-black/75 px-1 py-0.5 rounded -mt-3 border border-violet-500/40">
                      Waist Cinch: 68cm
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 -mr-1" />
                  </div>

                  <div className="absolute top-[49%] left-[30%] right-[30%] flex items-center justify-between border-b border-cyan-400/70 border-dashed">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -ml-1" />
                    <span className="text-[9px] font-mono-numbers text-cyan-300 bg-black/75 px-1 py-0.5 rounded -mt-3 border border-cyan-500/40">
                      Hips: 96cm
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -mr-1" />
                  </div>

                  <div className="absolute bottom-[10%] left-[24%] right-[24%] flex items-center justify-between border-b border-emerald-400/70 border-dashed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-1" />
                    <span className="text-[9px] font-mono-numbers text-emerald-300 bg-black/75 px-1 py-0.5 rounded -mt-3 border border-emerald-500/40">
                      Hem: 138cm
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mr-1" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FACE CLOSE-UP MAKEUP OVERLAYS */}
          {!isFullBodyMode && !vtoState.compareMode && !isBackView && (
            <div className="absolute inset-0 pointer-events-none">
              {vtoState.showLipColor && lipColor && (
                <div
                  className="absolute inset-0 mix-blend-multiply transition-opacity duration-200"
                  style={{
                    background: isProfile90
                      ? `radial-gradient(ellipse 10% 5% at 43% 65%, ${lipColor} 0%, transparent 100%)`
                      : isProfile45
                      ? `radial-gradient(ellipse 12% 5.5% at 47% 65.5%, ${lipColor} 0%, transparent 100%)`
                      : `radial-gradient(ellipse 13% 6.5% at 50% 65.5%, ${lipColor} 0%, transparent 100%)`,
                    opacity: vtoState.lipstickOpacity / 100,
                  }}
                />
              )}

              {vtoState.showEyeMakeup && (
                <div
                  className="absolute inset-0 mix-blend-multiply transition-opacity duration-200"
                  style={{
                    background: isProfile90
                      ? `radial-gradient(ellipse 8% 4.5% at 41% 39%, ${eyeColor} 0%, transparent 100%)`
                      : isProfile45
                      ? `radial-gradient(ellipse 8% 4.5% at 45% 38.5%, ${eyeColor} 0%, transparent 100%), radial-gradient(ellipse 6% 3.5% at 29% 39.5%, ${eyeColor} 0%, transparent 100%)`
                      : `radial-gradient(ellipse 8.5% 4.5% at 37% 38%, ${eyeColor} 0%, transparent 100%), radial-gradient(ellipse 8.5% 4.5% at 63% 38%, ${eyeColor} 0%, transparent 100%)`,
                    opacity: (vtoState.eyeMakeupOpacity || 75) / 100,
                  }}
                />
              )}

              {vtoState.showBlush && blushColor && (
                <div
                  className="absolute inset-0 mix-blend-color-burn transition-opacity duration-200"
                  style={{
                    background: isProfile90
                      ? `radial-gradient(ellipse 14% 10% at 48% 50%, ${blushColor} 0%, transparent 100%)`
                      : isProfile45
                      ? `radial-gradient(ellipse 14% 10% at 41% 51%, ${blushColor} 0%, transparent 100%)`
                      : `radial-gradient(ellipse 13% 9% at 33% 52%, ${blushColor} 0%, transparent 100%), radial-gradient(ellipse 13% 9% at 67% 52%, ${blushColor} 0%, transparent 100%)`,
                    opacity: vtoState.blushOpacity / 100,
                  }}
                />
              )}
            </div>
          )}

          {isBackView && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/85 text-white text-[11px] font-semibold rounded-md backdrop-blur-md">
              180° Back View · Rear Silhouette & Drape
            </div>
          )}
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 p-1 bg-[#111827]/90 backdrop-blur-md rounded-xl border border-[#374151] shadow-lg z-10">
          <button
            type="button"
            onClick={() => adjustZoom(0.25)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#283344] text-[#F9FAFB] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            type="button"
            onClick={() => adjustZoom(-0.25)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#283344] text-[#F9FAFB] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            type="button"
            onClick={() => adjustZoom(1.0 - vtoState.zoomLevel)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#283344] text-[10px] font-mono-numbers font-bold text-[#F9FAFB] transition-colors"
            title="Reset Zoom to 1x"
          >
            1x
          </button>
        </div>

        {/* Angle & Magnification Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 bg-[#111827]/90 backdrop-blur-md rounded-xl border border-[#374151] shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs font-semibold text-[#F9FAFB]">{currentModel.label}</span>
          <span className="text-xs font-mono-numbers text-slate-400">
            ({Math.round(sliderAngle)}°)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs font-mono-numbers font-semibold text-cyan-300">
            {Math.round(vtoState.zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Angle Presets Bar */}
      <div className="flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2 pt-1">
        <span className="font-semibold text-[#F9FAFB]">Angle Presets:</span>
        <div className="flex items-center gap-1.5 p-1 bg-[#161f2e] border border-[#374151] rounded-lg">
          <button
            onClick={() => handleAnglePreset(0, 1.0, { x: 0, y: 0 })}
            className={`min-h-[30px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentModel.angle === 0 && vtoState.zoomLevel === 1.0
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Front (0°)
          </button>
          <button
            onClick={() => handleAnglePreset(45, isFullBodyMode ? 1.15 : 1.85, { x: 0, y: 0 })}
            className={`min-h-[30px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentModel.angle === 45
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            45° Profile
          </button>
          <button
            onClick={() => handleAnglePreset(90, isFullBodyMode ? 1.2 : 2.4, { x: 0, y: 0 })}
            className={`min-h-[30px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentModel.angle === 90
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Side (90°)
          </button>
          <button
            onClick={() => handleAnglePreset(180, isFullBodyMode ? 1.1 : 1.25, { x: 0, y: 0 })}
            className={`min-h-[30px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              currentModel.angle === 180
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Back (180°)
          </button>
        </div>
      </div>

      {/* Rotation Slider & Play/Pause */}
      <div className="space-y-3 pt-2 border-t border-[#374151]">
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>360° Continuous Turntable</span>
          </span>
          <span className="font-mono-numbers font-bold text-cyan-300">
            {Math.round(sliderAngle)}° / 360°
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="359"
          value={Math.round(sliderAngle)}
          onChange={(e) => {
            const deg = parseInt(e.target.value, 10);
            setSliderAngle(deg);
            onUpdateVTO({ angle: deg, isRotating: false });
            if (deg % 45 === 0) triggerHaptic(10);
          }}
          className="w-full h-2 bg-[#161f2e] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-[#374151]"
        />

        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic([20, 40]);
                onUpdateVTO({ isRotating: !vtoState.isRotating });
              }}
              className={`min-h-[36px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                vtoState.isRotating
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                  : 'bg-[#1f2937] hover:bg-[#283344] text-white border border-[#374151]'
              }`}
            >
              {vtoState.isRotating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Rotate 360°</span>
                </>
              )}
            </button>

            {isFullBodyMode && (
              <button
                onClick={() => {
                  triggerHaptic(15);
                  onUpdateVTO({ showBodyFitOverlay: !vtoState.showBodyFitOverlay });
                }}
                className={`min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  vtoState.showBodyFitOverlay
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-[#1f2937] border-[#374151] text-slate-300 hover:bg-[#283344]'
                }`}
              >
                <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                <span>{vtoState.showBodyFitOverlay ? 'Guides: ON' : 'Show Guides'}</span>
              </button>
            )}
          </div>

          {/* Quick Focal Zone Selector */}
          {isFullBodyMode ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleBodyFocus('silhouette')}
                className="px-2 py-1 rounded bg-[#161f2e] text-[11px] text-slate-300 border border-[#374151] hover:text-white"
              >
                Silhouette
              </button>
              <button
                onClick={() => handleBodyFocus('waist')}
                className="px-2 py-1 rounded bg-[#161f2e] text-[11px] text-slate-300 border border-[#374151] hover:text-white"
              >
                Waist
              </button>
              <button
                onClick={() => handleBodyFocus('bodice')}
                className="px-2 py-1 rounded bg-[#161f2e] text-[11px] text-slate-300 border border-[#374151] hover:text-white"
              >
                Bodice
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFaceRegionFocusAndToggle('eyes')}
                className="px-2 py-1 rounded bg-[#161f2e] text-[11px] text-slate-300 border border-[#374151] hover:text-white"
              >
                Eyes (2.6x)
              </button>
              <button
                onClick={() => handleFaceRegionFocusAndToggle('lips')}
                className="px-2 py-1 rounded bg-[#161f2e] text-[11px] text-slate-300 border border-[#374151] hover:text-white"
              >
                Lips (2.5x)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK WARDROBE TRY-ON STRIP (If in full body mode) OR COSMETICS STRIP */}
      {isFullBodyMode ? (
        <div className="p-3 rounded-2xl bg-[#161f2e] border border-[#374151] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F9FAFB] flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-cyan-400" />
              <span>Wardrobe Try-On ({userShape} Fit)</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {bodyShapeFit.matchScore}% Match
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {APPAREL_CATALOG.map((apparel) => {
              const isSelected = apparel.id === selectedApparel.id;
              return (
                <button
                  key={apparel.id}
                  onClick={() => {
                    triggerHaptic(15);
                    onUpdateVTO({
                      selectedApparelId: apparel.id,
                      selectedApparelColor: apparel.colorHex,
                    });
                  }}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#1f2937] border-cyan-400 shadow-md ring-1 ring-cyan-500/40'
                      : 'bg-[#111827] border-[#374151] hover:border-slate-500'
                  }`}
                >
                  <img
                    src={apparel.image}
                    alt={apparel.name}
                    className="w-full h-16 object-cover rounded-lg border border-[#374151] mb-1.5"
                  />
                  <div className="text-[11px] font-bold text-[#F9FAFB] truncate">
                    {apparel.name}
                  </div>
                  <div className="text-[10px] text-cyan-300">${apparel.price.toFixed(2)}</div>
                </button>
              );
            })}
          </div>

          {/* Quick Add Outfit to Bag */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1">
              {selectedApparel.availableColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    triggerHaptic(10);
                    onUpdateVTO({ selectedApparelColor: c.hex });
                  }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    apparelColorHex === c.hex
                      ? 'ring-2 ring-cyan-400 scale-110'
                      : 'border border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            <button
              onClick={() => handleAddOutfitToBag(selectedApparel)}
              className="flex-1 min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag · ${selectedApparel.price.toFixed(2)}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Face Quick Cosmetic Strip */
        <div className="p-3 rounded-2xl bg-[#161f2e] border border-[#374151] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#F9FAFB]">
            <span>Lip Shade Swatches</span>
            <span className="text-cyan-400">
              {VTO_SHADES.lipsticks.find((s) => s.hex === vtoState.lipstickShade)?.name || 'Custom'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {VTO_SHADES.lipsticks.map((shade) => {
              const isSelected = vtoState.lipstickShade === shade.hex && vtoState.showLipColor;
              return (
                <button
                  key={shade.id}
                  onClick={() => {
                    triggerHaptic(10);
                    onUpdateVTO({ lipstickShade: shade.hex, showLipColor: true });
                  }}
                  className={`w-8 h-8 rounded-full shrink-0 transition-transform ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 scale-110 shadow-md'
                      : 'border border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: shade.hex }}
                  title={shade.name}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-white mx-auto my-1 drop-shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Generation Modal */}
      <AnimateVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        currentModelImage={displayImage}
      />
    </div>
  );
};
