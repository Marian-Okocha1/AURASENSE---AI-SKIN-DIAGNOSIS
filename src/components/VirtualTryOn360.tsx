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
  ArrowLeft,
  Shirt,
  ShoppingBag,
  Ruler,
  CheckCircle2,
  Info,
  Maximize2,
} from 'lucide-react';
import {
  VTOState,
  FocusRegion,
  BodyFocusRegion,
  SkinProfile,
  UserBodyProfile,
  ApparelItem,
  ProductItem,
} from '../types';
import {
  MODEL_ANGLES,
  FULL_BODY_MODEL_ANGLES,
  VTO_SHADES,
  APPAREL_CATALOG,
  getGarmentColorFilter,
} from '../data/mockData';
import { AnimateVideoModal } from './AnimateVideoModal';

interface VirtualTryOn360Props {
  vtoState: VTOState;
  skinProfile?: SkinProfile;
  bodyProfile?: UserBodyProfile;
  onUpdateVTO: (updates: Partial<VTOState>) => void;
  onSelectProductForVTO?: (shadeHex: string, shadeName: string) => void;
  onReturnToDashboard?: () => void;
  onAddToCart?: (product: ProductItem) => void;
}

export const VirtualTryOn360: React.FC<VirtualTryOn360Props> = ({
  vtoState,
  skinProfile,
  bodyProfile,
  onUpdateVTO,
  onReturnToDashboard,
  onAddToCart,
}) => {
  const [sliderAngle, setSliderAngle] = useState(vtoState.angle);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [hapticRipple, setHapticRipple] = useState(false);
  const [addedOutfitNotification, setAddedOutfitNotification] = useState<string | null>(null);

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

  // Active Apparel Selection
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
      return activeAngleSet[0]; // 0 deg
    } else if (normalized >= 22.5 && normalized < 67.5) {
      return activeAngleSet[1]; // 45 deg
    } else if (normalized >= 67.5 && normalized < 135) {
      return activeAngleSet[2]; // 90 deg
    } else if (normalized >= 135 && normalized < 225) {
      return activeAngleSet[3]; // 180 deg
    } else if (normalized >= 225 && normalized < 292.5) {
      return activeAngleSet[4]; // 270 deg (mirrored profile)
    } else {
      return activeAngleSet[5]; // 315 deg (mirrored 3/4)
    }
  };

  const currentModel = getClosestAngleModel(sliderAngle);
  const isBackView = currentModel.angle === 180;
  const isProfile90 = currentModel.angle === 90 || currentModel.angle === 270;
  const isProfile45 = currentModel.angle === 45 || currentModel.angle === 315;

  // Body Fit Analysis for user's detected body shape
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

  // Full Body Focal Area Presets
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
        panOffset: { x: 0, y: 24 }, // brings upper bodice & neckline to center
      });
    } else if (focus === 'waist') {
      onUpdateVTO({
        bodyFocusRegion: 'waist',
        zoomLevel: 2.2,
        panOffset: { x: 0, y: 3 }, // centers on waistline & sash
      });
    } else if (focus === 'hemline') {
      onUpdateVTO({
        bodyFocusRegion: 'hemline',
        zoomLevel: 1.7,
        panOffset: { x: 0, y: -26 }, // centers on lower hem & skirt drape
      });
    } else if (focus === 'face') {
      onUpdateVTO({
        bodyFocusRegion: 'face',
        zoomLevel: 2.7,
        panOffset: { x: 0, y: 38 }, // zooms into face on full body model
      });
    }
  };

  // Face Region Focus Handlers
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
    setAddedOutfitNotification(`Added "${product.name}" to your shopping bag!`);
    setTimeout(() => setAddedOutfitNotification(null), 3000);
  };

  const perspectiveRotateY = ((sliderAngle % 45) - 22.5) * 0.4;

  return (
    <div className="space-y-6">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#374151]">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {onReturnToDashboard && (
              <button
                onClick={onReturnToDashboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111827] hover:bg-[#283344] text-cyan-300 border border-[#374151] transition-colors shadow-sm mr-2 min-h-[36px]"
                title="Return to 3-Panel Diagnostics Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
            )}
            <h2 className="text-xl font-bold font-serif text-[#F9FAFB] flex items-center gap-2">
              <span>360° Virtual Try-On Studio</span>
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Rotate smoothly across 360 degrees to verify head-to-toe body shape fit, fabric drape, and coordinated beauty.
          </p>
        </div>

        {/* Global Toolbar: Haptics & Animate to Video */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              const next = !vtoState.hapticsEnabled;
              onUpdateVTO({ hapticsEnabled: next });
              if (next) triggerHaptic([30, 60, 30]);
            }}
            className={`min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              vtoState.hapticsEnabled
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-md'
                : 'bg-[#111827] text-slate-300 border-[#374151] hover:bg-[#283344]'
            }`}
            title="Toggle vibration and tactile feedback during interaction"
          >
            <Vibrate className="w-3.5 h-3.5" />
            <span>Haptics: {vtoState.hapticsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111827] hover:bg-[#283344] text-cyan-300 border border-[#374151] rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Animate 360° to Video</span>
          </button>
        </div>
      </div>

      {/* Primary Mode Switcher: Full Body & Wardrobe vs Face & Beauty Close-Up */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-[#111827] border border-[#374151] rounded-2xl shadow-lg">
        <div className="flex items-center gap-1 p-1 bg-[#161f2e] border border-[#374151] rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              triggerHaptic(20);
              onUpdateVTO({
                viewMode: 'fullBody',
                zoomLevel: 1.0,
                panOffset: { x: 0, y: 0 },
              });
            }}
            className={`flex-1 sm:flex-initial min-h-[42px] px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isFullBodyMode
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Full Body & Apparel Try-On</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-cyan-200">
              360° Silhouette
            </span>
          </button>

          <button
            onClick={() => {
              triggerHaptic(20);
              onUpdateVTO({
                viewMode: 'face',
                zoomLevel: 1.0,
                panOffset: { x: 0, y: 0 },
              });
            }}
            className={`flex-1 sm:flex-initial min-h-[42px] px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              !isFullBodyMode
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Face & Beauty Close-Up</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 text-violet-200">
              Lips & Eyes
            </span>
          </button>
        </div>

        {/* Live Body Shape Verification Pill in Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#161f2e] border border-[#374151] rounded-xl text-xs">
          <span className="text-slate-400">Target Silhouette:</span>
          <span className="font-bold text-violet-300">{userShape}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">Phototype:</span>
          <span className="font-bold text-cyan-300">Type {skinProfile?.fitzpatrickScale || 'III'}</span>
        </div>
      </div>

      {/* Added to Bag Toast Notification */}
      {addedOutfitNotification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-200 text-xs font-semibold animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{addedOutfitNotification}</span>
        </div>
      )}

      {/* Main Grid: 360 Viewer on Left, Fit Diagnostics / Wardrobe Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 360 Viewer Container */}
        <div className="lg:col-span-7 bg-[#111827] rounded-2xl border border-[#374151] p-5 shadow-xl flex flex-col">
          {/* Angle Preset Navigation */}
          <div className="flex items-center justify-between gap-1.5 pb-3 border-b border-[#374151] flex-wrap">
            <span className="text-xs font-semibold text-slate-300">
              {isFullBodyMode ? 'Body Angle Presets:' : 'Facial Angle Presets:'}
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-[#161f2e] border border-[#374151] rounded-lg">
              <button
                onClick={() => handleAnglePreset(0, 1.0, { x: 0, y: 0 })}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentModel.angle === 0 && vtoState.zoomLevel === 1.0
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Full Front Symmetry & Bodice Alignment"
              >
                Front (0°)
              </button>
              <button
                onClick={() => handleAnglePreset(45, isFullBodyMode ? 1.15 : 1.85, { x: 0, y: 0 })}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentModel.angle === 45
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Three-Quarter Silhouette & Side Drape"
              >
                45° Angle
              </button>
              <button
                onClick={() => handleAnglePreset(90, isFullBodyMode ? 1.2 : 2.4, { x: 0, y: 0 })}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentModel.angle === 90
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Side Profile Silhouette & Posture Depth"
              >
                Side Profile (90°)
              </button>
              <button
                onClick={() => handleAnglePreset(180, isFullBodyMode ? 1.1 : 1.25, { x: 0, y: 0 })}
                className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentModel.angle === 180
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Back View, Spine Seam & Hemline Sweep"
              >
                Back View (180°)
              </button>
            </div>
          </div>

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
            className={`relative w-full rounded-xl overflow-hidden bg-[#0d1524] border border-[#374151] select-none cursor-grab active:cursor-grabbing group flex items-center justify-center mt-3 shadow-inner ${
              isFullBodyMode ? 'aspect-[3/4] max-h-[640px]' : 'aspect-square max-h-[500px]'
            }`}
            style={{ perspective: '1200px' }}
          >
            {/* Smooth 3D Animated Model Container */}
            <div
              className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform flex items-center justify-center"
              style={{
                transform: `scale(${vtoState.zoomLevel}) translate(${vtoState.panOffset.x}%, ${vtoState.panOffset.y}%) rotateY(${perspectiveRotateY}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={currentModel.image}
                alt={`Virtual Try On Model ${currentModel.label}`}
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

              {/* FULL BODY APPAREL VIRTUAL TRY-ON OVERLAYS */}
              {isFullBodyMode && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Body Fit Measurement Laser Guidelines Overlay */}
                  {vtoState.showBodyFitOverlay && (
                    <div className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-200">
                      {/* Shoulder Width Guide */}
                      <div className="absolute top-[21%] left-[28%] right-[28%] flex items-center justify-between border-b border-cyan-400/70 border-dashed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -ml-1" />
                        <span className="text-[9px] font-mono-numbers text-cyan-300 bg-black/75 px-1.5 py-0.5 rounded -mt-3 border border-cyan-500/40">
                          Shoulders: 39cm · Balanced
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -mr-1" />
                      </div>

                      {/* Waist Cinching Contour Line */}
                      <div className="absolute top-[37%] left-[32%] right-[32%] flex items-center justify-between border-b border-violet-400/80 border-dashed">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 -ml-1" />
                        <span className="text-[9px] font-mono-numbers text-violet-300 bg-black/75 px-1.5 py-0.5 rounded -mt-3 border border-violet-500/40">
                          Waist Cinch: 68cm (-4cm Drape)
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 -mr-1" />
                      </div>

                      {/* Hip Flare Sweep Line */}
                      <div className="absolute top-[49%] left-[30%] right-[30%] flex items-center justify-between border-b border-cyan-400/70 border-dashed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -ml-1" />
                        <span className="text-[9px] font-mono-numbers text-cyan-300 bg-black/75 px-1.5 py-0.5 rounded -mt-3 border border-cyan-500/40">
                          Hips: 96cm · Skimming Flow
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 -mr-1" />
                      </div>

                      {/* Hemline Floor Drop Line */}
                      <div className="absolute bottom-[10%] left-[24%] right-[24%] flex items-center justify-between border-b border-emerald-400/70 border-dashed">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-1" />
                        <span className="text-[9px] font-mono-numbers text-emerald-300 bg-black/75 px-1.5 py-0.5 rounded -mt-3 border border-emerald-500/40">
                          Hemline: 138cm · Floor Sweeping
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -mr-1" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* FACE & BEAUTY CLOSE-UP VTO LAYERS */}
              {!isFullBodyMode && !vtoState.compareMode && !isBackView && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Lip Layer */}
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

                  {/* Eye Makeup Layer */}
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

                  {/* Cheek Blush Layer */}
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

                  {/* Foundation Finish */}
                  {vtoState.foundationFinish === 'dewy' && (
                    <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-tr from-cyan-400/20 via-violet-500/10 to-transparent pointer-events-none" />
                  )}
                  {vtoState.foundationFinish === 'matte' && (
                    <div className="absolute inset-0 backdrop-blur-[0.3px] mix-blend-soft-light bg-black/15 pointer-events-none" />
                  )}
                </div>
              )}

              {/* 180° Back View Indicator */}
              {isBackView && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/85 text-white text-[11px] font-semibold rounded-md backdrop-blur-md">
                  180° Back View · Rear Drape & Spine Line
                </div>
              )}
            </div>

            {hapticRipple && (
              <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-xl pointer-events-none animate-ping duration-300" />
            )}

            {/* Zoom Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 p-1 bg-[#111827]/90 backdrop-blur-md rounded-xl border border-[#374151] shadow-lg z-10">
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

            {/* Angle & Magnification Indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-[#111827]/90 backdrop-blur-md rounded-xl border border-[#374151] shadow-md">
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

            {vtoState.zoomLevel > 1.2 && (
              <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-[#111827]/90 backdrop-blur-xs text-slate-200 text-[11px] rounded-lg font-medium flex items-center gap-1.5 border border-[#374151]">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>Drag to pan focal zone</span>
              </div>
            )}
          </div>

          {/* Focal Area Buttons */}
          {isFullBodyMode ? (
            <div className="flex items-center justify-between text-xs pt-3 text-slate-300 flex-wrap gap-2">
              <span className="font-semibold text-[#F9FAFB]">Inspect Garment Fit Zones:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleBodyFocus('silhouette')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    vtoState.bodyFocusRegion === 'silhouette' && vtoState.zoomLevel === 1.0
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  Full Silhouette (1x)
                </button>
                <button
                  onClick={() => handleBodyFocus('bodice')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    vtoState.bodyFocusRegion === 'bodice'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  Bodice & Neckline (1.85x)
                </button>
                <button
                  onClick={() => handleBodyFocus('waist')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    vtoState.bodyFocusRegion === 'waist'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  Waist & Sash (2.2x)
                </button>
                <button
                  onClick={() => handleBodyFocus('hemline')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    vtoState.bodyFocusRegion === 'hemline'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  Hemline & Sweep (1.7x)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs pt-3 text-slate-300 flex-wrap gap-2">
              <span className="font-semibold text-[#F9FAFB]">Target Facial Region & Focus:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleFaceRegionFocusAndToggle('all')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                    vtoState.activeFocusRegion === 'all'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  Full Face (1x)
                </button>
                <button
                  onClick={() => handleFaceRegionFocusAndToggle('eyes')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    vtoState.activeFocusRegion === 'eyes'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Eyes (2.6x)</span>
                </button>
                <button
                  onClick={() => handleFaceRegionFocusAndToggle('lips')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    vtoState.activeFocusRegion === 'lips'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Lips (2.5x)</span>
                </button>
                <button
                  onClick={() => handleFaceRegionFocusAndToggle('cheek')}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                    vtoState.activeFocusRegion === 'cheek'
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                      : 'bg-[#1f2937] text-slate-300 border-[#374151] hover:bg-[#283344]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Cheeks (2.2x)</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Scrub Slider & Rotation Controls */}
          <div className="mt-4 space-y-4 pt-3 border-t border-[#374151]">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>360° Smooth Turntable</span>
              </span>
              <span className="font-mono-numbers font-bold text-cyan-300">
                {Math.round(sliderAngle)}° / 360°
              </span>
            </div>

            <div className="relative">
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
                className="w-full h-2 bg-[#161f2e] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-[#374151] focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers mt-1.5">
                <span>0° (Front)</span>
                <span>90° (Side)</span>
                <span>180° (Back)</span>
                <span>270° (Side)</span>
                <span>360°</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic([20, 40]);
                    onUpdateVTO({ isRotating: !vtoState.isRotating });
                  }}
                  className={`min-h-[38px] flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    vtoState.isRotating
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md'
                      : 'bg-[#1f2937] hover:bg-[#283344] text-white border border-[#374151]'
                  }`}
                >
                  {vtoState.isRotating ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause 360°</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Rotate 360°</span>
                    </>
                  )}
                </button>

                {vtoState.isRotating && (
                  <div className="flex items-center gap-1 bg-[#161f2e] p-1 rounded-md text-[11px] font-semibold text-slate-300 border border-[#374151]">
                    <button
                      onClick={() => onUpdateVTO({ rotationSpeed: 1 })}
                      className={`px-2 py-0.5 rounded ${
                        vtoState.rotationSpeed === 1 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : ''
                      }`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => onUpdateVTO({ rotationSpeed: 2 })}
                      className={`px-2 py-0.5 rounded ${
                        vtoState.rotationSpeed === 2 ? 'bg-cyan-500/30 text-cyan-300 font-bold' : ''
                      }`}
                    >
                      2x
                    </button>
                  </div>
                )}
              </div>

              {/* In full body mode: Toggle Body Measurement Laser Lines */}
              {isFullBodyMode ? (
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    onUpdateVTO({ showBodyFitOverlay: !vtoState.showBodyFitOverlay });
                  }}
                  className={`min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    vtoState.showBodyFitOverlay
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                      : 'bg-[#1f2937] border-[#374151] text-slate-300 hover:bg-[#283344]'
                  }`}
                >
                  <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {vtoState.showBodyFitOverlay ? 'Fit Guidelines: ON' : 'Show Measurement Grid'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    triggerHaptic(20);
                    onUpdateVTO({ compareMode: !vtoState.compareMode });
                  }}
                  className={`min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    vtoState.compareMode
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-[#1f2937] border-[#374151] text-slate-300 hover:bg-[#283344]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{vtoState.compareMode ? 'Viewing Baseline' : 'Compare Before/After'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL CONTROLS: EITHER FULL BODY WARDROBE FIT OR FACIAL BEAUTY */}
        <div className="lg:col-span-5 space-y-5">
          {isFullBodyMode ? (
            /* ================= FULL BODY APPAREL TRY-ON HUB ================= */
            <>
              {/* 1. "Will This Fit My Body Shape?" Diagnostic Card */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
                      Body Shape Fit Analysis
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-violet-300">{userShape} Silhouette</span>
                    <span className="text-xs font-mono-numbers font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                      {bodyShapeFit.matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Fit Meter Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Fit Compatibility for {userShape}</span>
                    <span className="font-semibold text-emerald-400">
                      {bodyShapeFit.matchScore >= 90
                        ? 'Optimal Natural Fit'
                        : bodyShapeFit.matchScore >= 80
                        ? 'Flattering Contour'
                        : 'May Require Tailoring'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#161f2e] rounded-full overflow-hidden border border-[#374151]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${bodyShapeFit.matchScore}%` }}
                    />
                  </div>
                </div>

                {/* Verdict explanation */}
                <div className="p-3 bg-[#161f2e] rounded-lg border border-[#374151] text-xs text-slate-200 leading-relaxed">
                  <span className="font-semibold text-cyan-300">Stylist Verdict: </span>
                  {bodyShapeFit.verdict}
                </div>

                {/* 4-Zone Measurement Verification */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#1f2937] border border-[#374151]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Shoulders & Bodice</div>
                    <div className="font-medium text-slate-200 mt-0.5">{bodyShapeFit.fitAnalysis.shoulders}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1f2937] border border-[#374151]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Waistline Cinch</div>
                    <div className="font-medium text-slate-200 mt-0.5">{bodyShapeFit.fitAnalysis.waist}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1f2937] border border-[#374151]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Hip & Thigh Flow</div>
                    <div className="font-medium text-slate-200 mt-0.5">{bodyShapeFit.fitAnalysis.hips}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#1f2937] border border-[#374151]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Length & Drape</div>
                    <div className="font-medium text-slate-200 mt-0.5">{bodyShapeFit.fitAnalysis.length}</div>
                  </div>
                </div>
              </div>

              {/* 2. Wardrobe Catalog Selector */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#374151]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Select Garment to Virtually Try On</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{APPAREL_CATALOG.length} Pieces</span>
                </div>

                <div className="space-y-2.5">
                  {APPAREL_CATALOG.map((apparel) => {
                    const isSelected = apparel.id === selectedApparel.id;
                    const shapeMatch =
                      apparel.compatibleBodyShapes.find((s) => s.shape === userShape)?.matchScore ||
                      90;

                    return (
                      <div
                        key={apparel.id}
                        onClick={() => {
                          triggerHaptic(15);
                          onUpdateVTO({
                            selectedApparelId: apparel.id,
                            selectedApparelColor: apparel.colorHex,
                          });
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#161f2e] border-cyan-400 shadow-md ring-1 ring-cyan-500/30'
                            : 'bg-[#1f2937] border-[#374151] hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={apparel.image}
                            alt={apparel.name}
                            className="w-14 h-14 object-cover rounded-lg border border-[#374151]"
                          />
                          <div>
                            <div className="text-xs font-bold text-[#F9FAFB]">{apparel.name}</div>
                            <div className="text-[11px] text-slate-400">
                              {apparel.category} · ${apparel.price.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-cyan-300 mt-0.5">
                              {shapeMatch}% Compatible with {userShape}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-sm'
                              : 'bg-[#111827] text-slate-300 border border-[#374151] hover:text-white'
                          }`}
                        >
                          {isSelected ? 'Fitted in 360°' : 'Try On'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Garment Customization: Color Swatches, Size & Sizing Guide */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm space-y-4">
                {/* Color Swatches */}
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#374151]">
                    <span className="font-bold text-[#F9FAFB]">Available Colorways</span>
                    <span className="text-cyan-300 font-semibold">
                      {selectedApparel.availableColors.find((c) => c.hex === apparelColorHex)
                        ?.name || selectedApparel.colorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    {selectedApparel.availableColors.map((color) => {
                      const isChosen = apparelColorHex === color.hex;
                      return (
                        <button
                          key={color.name}
                          onClick={() => {
                            triggerHaptic(15);
                            onUpdateVTO({ selectedApparelColor: color.hex });
                          }}
                          className="flex flex-col items-center gap-1 group focus:outline-none"
                          title={color.name}
                        >
                          <div
                            className={`w-9 h-9 rounded-full transition-transform ${
                              isChosen
                                ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#111827] scale-110 shadow-md'
                                : 'border border-white/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isChosen && (
                              <Check className="w-4 h-4 text-white mx-auto my-2 drop-shadow-sm" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-300 font-medium">
                            {color.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sizing Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#374151]">
                    <span className="font-bold text-[#F9FAFB]">Select Size</span>
                    <span className="text-violet-300 font-semibold">
                      Size {vtoState.selectedApparelSize || 'M'} (Optimal for {userShape})
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2 mt-3">
                    {selectedApparel.sizes.map((sz) => {
                      const isSizeActive = (vtoState.selectedApparelSize || 'M') === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => {
                            triggerHaptic(15);
                            onUpdateVTO({ selectedApparelSize: sz });
                          }}
                          className={`min-h-[38px] rounded-lg text-xs font-bold transition-all border ${
                            isSizeActive
                              ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-sm'
                              : 'bg-[#1f2937] text-slate-200 border-[#374151] hover:border-slate-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Add Outfit to Bag CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => handleAddOutfitToBag(selectedApparel)}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 via-violet-600 to-cyan-500 hover:from-cyan-400 hover:to-violet-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add {selectedApparel.name} to Bag · ${selectedApparel.price.toFixed(2)}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================= FACIAL BEAUTY & COSMETICS CONTROLS ================= */
            <>
              {/* Lipstick Shade Picker */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vtoState.showLipColor}
                      onChange={(e) => onUpdateVTO({ showLipColor: e.target.checked })}
                      className="w-3.5 h-3.5 accent-cyan-500 rounded border-slate-600 bg-[#1f2937]"
                    />
                    <span>1. Lip Color & Pigment</span>
                  </label>
                  <span className="text-xs font-semibold text-cyan-400">
                    {VTO_SHADES.lipsticks.find((s) => s.hex === vtoState.lipstickShade)?.name ||
                      'Custom'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2.5 my-3.5">
                  {VTO_SHADES.lipsticks.map((shade) => {
                    const isSelected =
                      vtoState.lipstickShade === shade.hex && vtoState.showLipColor;
                    return (
                      <button
                        key={shade.id}
                        onClick={() => {
                          triggerHaptic(15);
                          onUpdateVTO({ lipstickShade: shade.hex, showLipColor: true });
                        }}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                        title={`${shade.name} (${shade.desc})`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full transition-transform ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#111827] scale-110 shadow-md'
                              : 'border border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: shade.hex }}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white mx-auto my-2 drop-shadow-sm" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-300 line-clamp-1 text-center font-medium">
                          {shade.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                  <span>Color Intensity</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={vtoState.lipstickOpacity}
                    onChange={(e) => onUpdateVTO({ lipstickOpacity: parseInt(e.target.value, 10) })}
                    className="w-32 h-1.5 bg-[#161f2e] rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-[#374151]"
                  />
                  <span className="font-mono-numbers text-cyan-300 w-8 text-right font-semibold">
                    {vtoState.lipstickOpacity}%
                  </span>
                </div>
              </div>

              {/* Eye Shadow & Definition */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vtoState.showEyeMakeup}
                      onChange={(e) => onUpdateVTO({ showEyeMakeup: e.target.checked })}
                      className="w-3.5 h-3.5 accent-cyan-500 rounded border-slate-600 bg-[#1f2937]"
                    />
                    <span>2. Eye Shadow & Definition</span>
                  </label>
                  <span className="text-xs font-semibold text-cyan-400">
                    {VTO_SHADES.eyeshadows.find((s) => s.hex === vtoState.eyeMakeupColor)?.name ||
                      'Warm Bronze'}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 my-3.5">
                  {VTO_SHADES.eyeshadows.map((shade) => {
                    const isSelected =
                      vtoState.eyeMakeupColor === shade.hex && vtoState.showEyeMakeup;
                    return (
                      <button
                        key={shade.id}
                        onClick={() => {
                          triggerHaptic(15);
                          onUpdateVTO({ eyeMakeupColor: shade.hex, showEyeMakeup: true });
                        }}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                        title={`${shade.name} (${shade.desc})`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full transition-transform ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#111827] scale-110 shadow-md'
                              : 'border border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: shade.hex }}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 text-white mx-auto my-2 drop-shadow-sm" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-300 line-clamp-1 text-center font-medium">
                          {shade.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Complexion & Foundation Finish */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Foundation & Complexion Finish
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-3">
                  {VTO_SHADES.finishes.map((f) => {
                    const isActive = vtoState.foundationFinish === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          triggerHaptic(15);
                          onUpdateVTO({ foundationFinish: f.id as any });
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-all min-h-[44px] ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-md'
                            : 'border-[#374151] bg-[#1f2937] text-slate-200 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="text-xs font-semibold">{f.name}</div>
                        <div
                          className={`text-[10px] mt-0.5 line-clamp-1 ${
                            isActive ? 'text-cyan-100' : 'text-slate-400'
                          }`}
                        >
                          {f.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cheek Blush Tint */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vtoState.showBlush}
                      onChange={(e) => onUpdateVTO({ showBlush: e.target.checked })}
                      className="w-3.5 h-3.5 accent-cyan-500 rounded border-slate-600 bg-[#1f2937]"
                    />
                    <span>4. Cheek Sculpt & Blush</span>
                  </label>
                  <span className="text-xs font-semibold text-cyan-400">
                    {VTO_SHADES.blushes.find((b) => b.hex === vtoState.blushTone)?.name || 'Custom'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 my-3">
                  {VTO_SHADES.blushes.map((b) => {
                    const isSelected = vtoState.blushTone === b.hex && vtoState.showBlush;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          triggerHaptic(15);
                          onUpdateVTO({ blushTone: b.hex, showBlush: true });
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all min-h-[40px] ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white border-transparent shadow-md font-semibold'
                            : 'border-[#374151] bg-[#1f2937] text-slate-200 hover:border-cyan-500/50'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: b.hex }}
                        />
                        <span className="truncate">{b.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skin AI Diagnostic Visualizers */}
              <div className="bg-[#111827] rounded-xl border border-[#374151] p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#374151]">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>5. Skin AI Diagnostic Visualizers</span>
                  </span>
                </div>

                <div className="space-y-2.5 mt-3">
                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#374151] bg-[#161f2e] hover:bg-[#1f2937] cursor-pointer min-h-[44px]">
                    <span className="text-xs font-medium text-slate-200">
                      Hydration Moisture Heatmap
                    </span>
                    <input
                      type="checkbox"
                      checked={vtoState.showHydrationHeatmap}
                      onChange={(e) => onUpdateVTO({ showHydrationHeatmap: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg border border-[#374151] bg-[#161f2e] hover:bg-[#1f2937] cursor-pointer min-h-[44px]">
                    <span className="text-xs font-medium text-slate-200">
                      Erythema / Redness Calming Overlay
                    </span>
                    <input
                      type="checkbox"
                      checked={vtoState.showRednessReduction}
                      onChange={(e) => onUpdateVTO({ showRednessReduction: e.target.checked })}
                      className="w-4 h-4 accent-rose-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Video Generation Modal */}
      <AnimateVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        currentModelImage={currentModel.image}
      />
    </div>
  );
};
