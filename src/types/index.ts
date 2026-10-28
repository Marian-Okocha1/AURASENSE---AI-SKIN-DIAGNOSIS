export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  speechCode: string;
  flag: string;
  samplePhrase: string;
  rtl?: boolean;
}

export type FitzpatrickScale = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface SkinMetrics {
  hydration: number;
  wrinkles: number;
  redness: number;
  darkCircles: number;
  pores: number;
  pigmentation: number;
  oiliness: number;
  skinAge: number;
  chronologicalAge: number;
  primaryConcerns: string[];
  skinType: 'Dry' | 'Combination' | 'Oily' | 'Sensitive' | 'Normal';
  overallHealthScore: number;
}

export interface SkinProfile extends SkinMetrics {
  fitzpatrickScale: FitzpatrickScale;
  fitzpatrickName: string;
  sunProtectionAdvice: string;
  melaninLevel: 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | 'Deep';
  recommendedSPF: number;
  uvSensitivity: 'Extreme' | 'High' | 'Moderate' | 'Low' | 'Minimal';
}

export interface BodyAttributes {
  taller: boolean;
  belly: boolean;
  slim: boolean;
  hip: boolean;
  waist: boolean;
  arm: boolean;
  leg: boolean;
  shoulder_left: boolean;
  shoulder_right: boolean;
}

export interface UserBodyProfile {
  bodyShape: 'Hourglass' | 'Pear' | 'Inverted Triangle' | 'Rectangle' | 'Apple' | 'Petite Slim' | 'Elongated Tall';
  attributes: BodyAttributes;
  proportionsSummary: string;
  stylingAdvice: {
    silhouette: string;
    flatteringCuts: string[];
    accentuateFeatures: string[];
    clothingFitAdvice: string;
    colorPaletteMatches: string[];
    vtoTryOnSuggestions: string[];
  };
}

export interface RoutineStep {
  phase: 'AM' | 'PM';
  stepNumber: number;
  category: string;
  name: string;
  activeIngredients: string[];
  instructions: string;
  frequency: string;
  matchedProductSku?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: 'Serums' | 'Moisturizers' | 'Sunscreen' | 'Lip Color' | 'Complexion & Foundation' | 'Blush & Glow' | 'Apparel & Styling';
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  shadeName?: string;
  shadeHex?: string;
  activeIngredients: string[];
  targetConcerns: string[];
  matchReason: string;
  checkoutUrl: string;
  bodyFitRationale?: string;
}

export type FocusRegion = 'all' | 'eyes' | 'lips' | 'cheek' | 'skin';
export type BodyFocusRegion = 'silhouette' | 'bodice' | 'waist' | 'hemline' | 'face';
export type VTOViewMode = 'fullBody' | 'face';

export interface ApparelColor {
  name: string;
  hex: string;
}

export interface ApparelFitShapeAnalysis {
  shape: UserBodyProfile['bodyShape'];
  matchScore: number; // 0 to 100
  verdict: string;
  fitAnalysis: {
    shoulders: string;
    waist: string;
    hips: string;
    length: string;
  };
}

export interface ApparelItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  colorName: string;
  colorHex: string;
  availableColors: ApparelColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom')[];
  fabricType: string;
  compatibleBodyShapes: ApparelFitShapeAnalysis[];
  highlights: string[];
  stylingTips: string;
  modelAngles?: {
    angle: number;
    label: string;
    sublabel: string;
    image: string;
    flip?: boolean;
  }[];
}

export interface VTOState {
  angle: number; // 0 to 359
  isRotating: boolean;
  rotationSpeed: number; // 1, 1.5, 2
  zoomLevel: number; // 1.0 to 3.5
  panOffset: { x: number; y: number };
  hapticsEnabled: boolean;
  activeFocusRegion: FocusRegion;
  // Full Body vs Face View Mode
  viewMode: VTOViewMode;
  bodyFocusRegion: BodyFocusRegion;
  // Apparel Try-On State
  selectedApparelId: string | null;
  selectedApparelColor: string;
  selectedApparelSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom';
  showBodyFitOverlay: boolean; // Highlights shoulder/waist/hip measurement zones
  showGarmentTexture: boolean;
  // Specific Cosmetic Layer Toggles & Settings
  showLipColor: boolean;
  lipstickShade: string;
  lipstickOpacity: number;
  showBlush: boolean;
  blushTone: string;
  blushOpacity: number;
  showEyeMakeup: boolean;
  eyeMakeupColor: string;
  eyeMakeupOpacity: number;
  foundationFinish: 'dewy' | 'matte' | 'satin';
  showHydrationHeatmap: boolean;
  showRednessReduction: boolean;
  showTextureSmoothing: boolean;
  compareMode: boolean; // Before vs After
}

export interface AnimateVideoState {
  isGenerating: boolean;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  duration: '5s';
  videoUrl: string | null;
  error: string | null;
  status: 'idle' | 'generating' | 'completed' | 'error';
}

export interface AgentShoppingRecommendation {
  fitzpatrickAdvice: string;
  bodyFitAdvice: string;
  flatteringOutfits: {
    title: string;
    silhouette: string;
    whyFlattering: string;
    pairedMakeup: string;
  }[];
  customAgentNotes: string;
}

export type ActiveTab = 'diagnostics' | 'tryon360' | 'recommendations' | 'report';
