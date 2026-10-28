import { SkinMetrics, SkinProfile, RoutineStep, ProductItem, UserBodyProfile, BodyAttributes, FitzpatrickScale, ApparelItem } from '../types';

export const INITIAL_SKIN_METRICS: SkinMetrics = {
  hydration: 44, // Low hydration
  wrinkles: 32, // Fine lines starting
  redness: 58, // Elevated redness / sensitivity
  darkCircles: 46, // Moderate under-eye fatigue
  pores: 38, // Visible t-zone pores
  pigmentation: 25, // Mild sun exposure spots
  oiliness: 52, // Balanced to slightly dehydrated surface sebum
  skinAge: 31,
  chronologicalAge: 28,
  primaryConcerns: ['Dehydration & Barrier Repair', 'Cheek Erythema / Redness', 'Under-Eye Dark Circles'],
  skinType: 'Sensitive',
  overallHealthScore: 74
};

export const INITIAL_SKIN_PROFILE: SkinProfile = {
  ...INITIAL_SKIN_METRICS,
  fitzpatrickScale: 'III',
  fitzpatrickName: 'Type III · Medium / Warm Olive',
  sunProtectionAdvice: 'Moderate burn risk; tans gradually to golden olive. SPF 50 recommended daily with antioxidant Vitamin C to prevent solar lentigines and post-inflammatory pigmentation.',
  melaninLevel: 'Medium',
  recommendedSPF: 50,
  uvSensitivity: 'Moderate',
};

export const INITIAL_BODY_PROFILE: UserBodyProfile = {
  bodyShape: 'Hourglass',
  attributes: {
    taller: false,
    belly: false,
    slim: true,
    hip: true,
    waist: true,
    arm: false,
    leg: true,
    shoulder_left: true,
    shoulder_right: true,
  },
  proportionsSummary: 'Balanced shoulders and hips with a defined, tapered waistline and elongated leg line.',
  stylingAdvice: {
    silhouette: 'Cinched Waist & Contoured Tailoring',
    flatteringCuts: [
      'Bias-cut silk midi dresses',
      'High-rise wide-leg pleated trousers',
      'Fitted wrap tops with tailored lapels',
      'Belted trench outerwear'
    ],
    accentuateFeatures: ['Defined natural waist', 'Balanced shoulder-hip geometry', 'Curvature flow'],
    clothingFitAdvice: 'Highlight waist tapering with structured belts or contoured darts. Avoid shapeless boxy tunics that conceal natural curves.',
    colorPaletteMatches: ['Saddle Cognac', 'Warm Terracotta', 'Espresso Noir', 'Burnished Gold', 'Champagne Silk'],
    vtoTryOnSuggestions: [
      'Contoured Silk Wrap Gown in Terracotta',
      'Structured Wool Trench in Cashmere Camel',
      'Tailored Pleated Trouser in Espresso'
    ]
  }
};

export const BODY_SHAPE_PRESETS: { name: string; label: string; payload: BodyAttributes }[] = [
  {
    name: 'hourglass',
    label: 'Hourglass (Waist + Hip Curvature)',
    payload: {
      taller: false,
      belly: false,
      slim: true,
      hip: true,
      waist: true,
      arm: false,
      leg: true,
      shoulder_left: true,
      shoulder_right: true,
    }
  },
  {
    name: 'pear',
    label: 'Pear (Fuller Hips & Graceful Upper)',
    payload: {
      taller: false,
      belly: false,
      slim: false,
      hip: true,
      waist: false,
      arm: false,
      leg: true,
      shoulder_left: false,
      shoulder_right: false,
    }
  },
  {
    name: 'inverted_triangle',
    label: 'Inverted Triangle (Sculpted Shoulders)',
    payload: {
      taller: true,
      belly: false,
      slim: true,
      hip: false,
      waist: false,
      arm: true,
      leg: true,
      shoulder_left: true,
      shoulder_right: true,
    }
  },
  {
    name: 'tall_elongated',
    label: 'Elongated Tall (Statuesque & Lean)',
    payload: {
      taller: true,
      belly: false,
      slim: true,
      hip: false,
      waist: true,
      arm: false,
      leg: true,
      shoulder_left: true,
      shoulder_right: true,
    }
  },
  {
    name: 'apple',
    label: 'Apple (Soft Midsection & Slim Limbs)',
    payload: {
      taller: false,
      belly: true,
      slim: false,
      hip: false,
      waist: false,
      arm: false,
      leg: true,
      shoulder_left: false,
      shoulder_right: false,
    }
  }
];

export const FITZPATRICK_PRESETS: { scale: FitzpatrickScale; name: string; advice: string; spf: number; melanin: any; uv: any }[] = [
  {
    scale: 'I',
    name: 'Type I · Ivory / Pale Porcelain',
    advice: 'Extreme UV vulnerability; burns always, never tans. SPF 50+ mineral physical screen (Zinc Oxide) required daily.',
    spf: 50,
    melanin: 'Very Low',
    uv: 'Extreme'
  },
  {
    scale: 'II',
    name: 'Type II · Fair Beige',
    advice: 'High UV sensitivity; burns easily, tans minimally. SPF 50+ broad-spectrum defense paired with ceramide barrier repair.',
    spf: 50,
    melanin: 'Low',
    uv: 'High'
  },
  {
    scale: 'III',
    name: 'Type III · Medium / Warm Olive',
    advice: 'Moderate burn risk; tans gradually to golden olive. SPF 50 recommended daily with antioxidant Vitamin C to prevent solar lentigines and post-inflammatory pigmentation.',
    spf: 50,
    melanin: 'Medium',
    uv: 'Moderate'
  },
  {
    scale: 'IV',
    name: 'Type IV · Olive / Moderate Brown',
    advice: 'Low burn risk; tans easily. SPF 30+ indicated; focus on azelaic acid & niacinamide to prevent post-inflammatory hyperpigmentation and melasma.',
    spf: 30,
    melanin: 'High',
    uv: 'Low'
  },
  {
    scale: 'V',
    name: 'Type V · Rich Bronze / Deep Brown',
    advice: 'Very low burn risk. SPF 30 daily broad spectrum; use sheer chemical formulations without white-cast. Rich nourishing squalane indicated.',
    spf: 30,
    melanin: 'Very High',
    uv: 'Minimal'
  },
  {
    scale: 'VI',
    name: 'Type VI · Deeply Pigmented Noir',
    advice: 'Minimal burn risk; high natural melanin defense. SPF 30 clear gel sunscreen to prevent photoaging; deep moisture barrier ceramides indicated.',
    spf: 30,
    melanin: 'Deep',
    uv: 'Minimal'
  }
];

export function parseYouCamSkinResponse(data: any): SkinProfile {
  const rawScale = (data?.fitzpatrick_scale || data?.fitzpatrickScale || 'III').toString().toUpperCase().replace('TYPE ', '').trim();
  const scale = (['I', 'II', 'III', 'IV', 'V', 'VI'].includes(rawScale) ? rawScale : 'III') as FitzpatrickScale;

  const found = FITZPATRICK_PRESETS.find((f) => f.scale === scale) || FITZPATRICK_PRESETS[2];

  return {
    hydration: typeof data?.hydration === 'number' ? data.hydration : 44,
    wrinkles: typeof data?.wrinkles === 'number' ? data.wrinkles : 32,
    redness: typeof data?.redness === 'number' ? data.redness : 58,
    darkCircles: typeof data?.darkCircles === 'number' ? data.darkCircles : 46,
    pores: typeof data?.pores === 'number' ? data.pores : 38,
    pigmentation: typeof data?.pigmentation === 'number' ? data.pigmentation : 25,
    oiliness: typeof data?.oiliness === 'number' ? data.oiliness : 52,
    skinAge: typeof data?.skinAge === 'number' ? data.skinAge : 31,
    chronologicalAge: typeof data?.chronologicalAge === 'number' ? data.chronologicalAge : 28,
    primaryConcerns: data?.primaryConcerns || ['Dehydration & Barrier Repair', 'Cheek Erythema / Redness', 'Under-Eye Dark Circles'],
    skinType: data?.skinType || 'Sensitive',
    overallHealthScore: typeof data?.overallHealthScore === 'number' ? data.overallHealthScore : 74,
    fitzpatrickScale: scale,
    fitzpatrickName: found.name,
    sunProtectionAdvice: found.advice,
    melaninLevel: found.melanin,
    recommendedSPF: found.spf,
    uvSensitivity: found.uv,
  };
}

export function parseYouCamBodyResponse(data: any): UserBodyProfile {
  const attrs: BodyAttributes = {
    taller: Boolean(data?.taller),
    belly: Boolean(data?.belly),
    slim: Boolean(data?.slim),
    hip: Boolean(data?.hip),
    waist: Boolean(data?.waist),
    arm: Boolean(data?.arm),
    leg: Boolean(data?.leg),
    shoulder_left: Boolean(data?.shoulder_left ?? data?.shoulder ?? true),
    shoulder_right: Boolean(data?.shoulder_right ?? data?.shoulder ?? true),
  };

  let shape: UserBodyProfile['bodyShape'] = 'Hourglass';
  let summary = '';
  let advice: UserBodyProfile['stylingAdvice'] = {
    silhouette: 'Tailored Wrap & Contour Fit',
    flatteringCuts: [],
    accentuateFeatures: [],
    clothingFitAdvice: '',
    colorPaletteMatches: [],
    vtoTryOnSuggestions: []
  };

  if (attrs.waist && attrs.hip) {
    shape = 'Hourglass';
    summary = 'Proportional shoulder and hip alignment with a distinctly tapered waistline.';
    advice = {
      silhouette: 'Cinched Waist & Contoured Tailoring',
      flatteringCuts: [
        'Bias-cut silk slip dresses',
        'High-rise wide-leg pleated trousers',
        'Fitted wrap tops with tailored lapels',
        'Belted trench outerwear'
      ],
      accentuateFeatures: ['Defined natural waist', 'Balanced shoulder-hip geometry', 'Curvature flow'],
      clothingFitAdvice: 'Highlight waist tapering with structured belts or contoured darts. Avoid shapeless boxy tunics that conceal natural curves.',
      colorPaletteMatches: ['Saddle Cognac', 'Warm Terracotta', 'Espresso Noir', 'Burnished Gold', 'Champagne Silk'],
      vtoTryOnSuggestions: [
        'Contoured Silk Wrap Gown in Terracotta',
        'Structured Wool Trench in Cashmere Camel',
        'Tailored Pleated Trouser in Espresso'
      ]
    };
  } else if (attrs.hip && !attrs.waist) {
    shape = 'Pear';
    summary = 'Fuller hip and thigh curvature with balanced, graceful upper frame.';
    advice = {
      silhouette: 'A-Line & Elevated Shoulder Focus',
      flatteringCuts: [
        'Flowing A-line skirts',
        'Boatneck and structured shoulder blazers',
        'High-waisted bootcut trousers',
        'Fit-and-flare dresses'
      ],
      accentuateFeatures: ['Delicate neckline & collarbones', 'Graceful hip sweep'],
      clothingFitAdvice: 'Draw visual balance upward with statement shoulders and structured collars. Choose fluid fabrics that skim over hips gently.',
      colorPaletteMatches: ['Burnt Amber', 'Ivory Cashmere', 'Deep Forest Emerald', 'Warm Sienna'],
      vtoTryOnSuggestions: [
        'A-Line Silk Gown with Boatneck in Amber',
        'Sharp Shoulder Crepe Blazer in Ivory'
      ]
    };
  } else if ((attrs.shoulder_left || attrs.shoulder_right) && !attrs.hip) {
    shape = 'Inverted Triangle';
    summary = 'Athletic, sculpted shoulder line with a slim hip profile and elongated legs.';
    advice = {
      silhouette: 'V-Neck & Fluid Lower-Volume Tailoring',
      flatteringCuts: [
        'Deep V-neck and wrap bodices',
        'Wide-leg palazzo trousers',
        'Pleated midi skirts',
        'Raglan sleeve knitwear'
      ],
      accentuateFeatures: ['Sculpted shoulders', 'Slender leg silhouette'],
      clothingFitAdvice: 'Balance strong shoulder architecture by softening upper necklines and introducing movement or volume in trousers and skirts.',
      colorPaletteMatches: ['Warm Camel', 'Dark Charcoal Espresso', 'Champagne', 'Terracotta Bronze'],
      vtoTryOnSuggestions: [
        'Silk Palazzo Pant Set in Camel',
        'Draped Halter Gown in Terracotta Sunset'
      ]
    };
  } else if (attrs.belly && !attrs.waist) {
    shape = 'Apple';
    summary = 'Soft midsection contour with shapely limbs and delicate bustline.';
    advice = {
      silhouette: 'Empire Line & Columnar Fluidity',
      flatteringCuts: [
        'Empire-waist tunics and gowns',
        'Open-front unbuttoned longline coats',
        'Straight-leg tailored trousers',
        'Fluid V-neck drape blouses'
      ],
      accentuateFeatures: ['Graceful neckline', 'Slender legs and ankles'],
      clothingFitAdvice: 'Create vertical elongation with single-tone columnar styling and fluid layers. Avoid tight belts at the widest point of the waist.',
      colorPaletteMatches: ['Monochrome Espresso', 'Deep Olive Greige', 'Saddle Tan', 'Warm Stone'],
      vtoTryOnSuggestions: [
        'Column Silk Crepe Gown in Espresso',
        'Fluid Duster Coat in Warm Stone'
      ]
    };
  } else if (attrs.taller && attrs.slim) {
    shape = 'Elongated Tall';
    summary = 'Statuesque, elongated silhouette with lean proportions from shoulder to ankle.';
    advice = {
      silhouette: 'Architectural Floor-Sweeping & Dramatic Drapes',
      flatteringCuts: [
        'Floor-length duster coats',
        'Wide cuff puddle trousers',
        'Oversized structured blazers',
        'Bias-cut column gowns'
      ],
      accentuateFeatures: ['Statuesque height', 'Lean elongated frame'],
      clothingFitAdvice: 'Lean into dramatic lengths and architectural silhouettes that celebrate height without truncation.',
      colorPaletteMatches: ['Atelier Camel', 'Warm Greige', 'Cognac Leather', 'Noir'],
      vtoTryOnSuggestions: [
        'Floor-Length Cashmere Trench in Camel',
        'Tailored Puddle Pant in Noir'
      ]
    };
  } else {
    shape = 'Rectangle';
    summary = 'Harmonious, athletic straight-line frame with equal balance across torso.';
    advice = {
      silhouette: 'Layered Dimensions & Asymmetric Drape',
      flatteringCuts: [
        'Belted utility blazers',
        'Asymmetrical wrap skirts',
        'Cowl-neck tops',
        'Tiered dresses'
      ],
      accentuateFeatures: ['Balanced athletic symmetry', 'Toned arms & shoulders'],
      clothingFitAdvice: 'Use color blocking, asymmetric hems, and belts to visually construct dimension and curve.',
      colorPaletteMatches: ['Terracotta', 'Amber Gold', 'Rich Espresso', 'Oatmeal Silk'],
      vtoTryOnSuggestions: [
        'Asymmetric Draped Dress in Amber Gold',
        'Belted Utility Blazer in Terracotta'
      ]
    };
  }

  return {
    bodyShape: shape,
    attributes: attrs,
    proportionsSummary: summary,
    stylingAdvice: advice
  };
}

export const SKIN_PRESETS: { name: string; label: string; fitzpatrick: FitzpatrickScale; metrics: SkinMetrics }[] = [
  {
    name: 'sensitive_dry',
    label: 'Sensitive & Dehydrated (Type III)',
    fitzpatrick: 'III',
    metrics: {
      hydration: 44,
      wrinkles: 32,
      redness: 58,
      darkCircles: 46,
      pores: 38,
      pigmentation: 25,
      oiliness: 52,
      skinAge: 31,
      chronologicalAge: 28,
      primaryConcerns: ['Dehydration & Barrier Repair', 'Cheek Erythema / Redness', 'Under-Eye Dark Circles'],
      skinType: 'Sensitive',
      overallHealthScore: 74
    }
  },
  {
    name: 'radiant_balanced',
    label: 'Balanced & Glowing (Type II)',
    fitzpatrick: 'II',
    metrics: {
      hydration: 82,
      wrinkles: 14,
      redness: 18,
      darkCircles: 20,
      pores: 22,
      pigmentation: 15,
      oiliness: 48,
      skinAge: 26,
      chronologicalAge: 28,
      primaryConcerns: ['Antioxidant Maintenance', 'UV Defense', 'Subtle Dewiness'],
      skinType: 'Normal',
      overallHealthScore: 92
    }
  },
  {
    name: 'oily_acne',
    label: 'Oily & Congested (Type IV)',
    fitzpatrick: 'IV',
    metrics: {
      hydration: 52,
      wrinkles: 20,
      redness: 65,
      darkCircles: 34,
      pores: 72,
      pigmentation: 40,
      oiliness: 84,
      skinAge: 30,
      chronologicalAge: 28,
      primaryConcerns: ['Pore Decongestion', 'Sebum Regulation', 'Post-Inflammatory Erythema'],
      skinType: 'Oily',
      overallHealthScore: 68
    }
  },
  {
    name: 'deep_melanin_dry',
    label: 'Deep Melanin & Barrier Plump (Type VI)',
    fitzpatrick: 'VI',
    metrics: {
      hydration: 40,
      wrinkles: 24,
      redness: 16,
      darkCircles: 48,
      pores: 36,
      pigmentation: 42,
      oiliness: 38,
      skinAge: 29,
      chronologicalAge: 30,
      primaryConcerns: ['Ashiness Prevention', 'Ceramide Nourishment', 'Even Tone Luminosity'],
      skinType: 'Dry',
      overallHealthScore: 78
    }
  },
  {
    name: 'mature_dry',
    label: 'Mature & Fine Lines (Type I)',
    fitzpatrick: 'I',
    metrics: {
      hydration: 38,
      wrinkles: 62,
      redness: 35,
      darkCircles: 58,
      pores: 48,
      pigmentation: 54,
      oiliness: 34,
      skinAge: 46,
      chronologicalAge: 42,
      primaryConcerns: ['Collagen Boosting', 'Deep Cellular Hydration', 'Extreme UV Sun Shield'],
      skinType: 'Dry',
      overallHealthScore: 70
    }
  }
];

export const RECOMMENDED_ROUTINES: RoutineStep[] = [
  {
    phase: 'AM',
    stepNumber: 1,
    category: 'Gentle Cleanser',
    name: 'Calming Oat & Ceramide Barrier Wash',
    activeIngredients: ['Colloidal Oatmeal 2%', 'Ceramide NP', 'Glycerin'],
    instructions: 'Cleanse with lukewarm water for 45 seconds to refresh without stripping moisture.',
    frequency: 'Daily morning',
    matchedProductSku: 'AURA-CLN-01'
  },
  {
    phase: 'AM',
    stepNumber: 2,
    category: 'Targeted Serum',
    name: 'Triple Hyaluronic & Centella Moisture Surge',
    activeIngredients: ['Multi-Weight Hyaluronic Acid 2%', 'Madecassoside (Centella)', 'Vitamin B5 Panthenol'],
    instructions: 'Press 3 drops into damp skin to quench parched deeper dermis layers and calm erythema.',
    frequency: 'Daily morning',
    matchedProductSku: 'AURA-SRM-02'
  },
  {
    phase: 'AM',
    stepNumber: 3,
    category: 'Barrier Cream',
    name: 'Peptide Cloud Radiance Emulsion',
    activeIngredients: ['Copper Peptides', 'Squalane', 'Niacinamide 3%'],
    instructions: 'Massage evenly over face and neck to seal moisture and plump fine expression lines.',
    frequency: 'Daily morning',
    matchedProductSku: 'AURA-CRM-03'
  },
  {
    phase: 'AM',
    stepNumber: 4,
    category: 'Sunscreen Protection',
    name: 'Invisible Dew SPF 50+ Broad Spectrum',
    activeIngredients: ['Zinc Oxide 12%', 'Ectoin', 'Green Tea Polyphenols'],
    instructions: 'Apply 2 finger lengths as final step 15 minutes before outdoor exposure.',
    frequency: 'Daily morning',
    matchedProductSku: 'AURA-SPF-04'
  },
  {
    phase: 'PM',
    stepNumber: 1,
    category: 'Night Restorative Cleanser',
    name: 'Nourishing Squalane Milk Cleanser',
    activeIngredients: ['Plant Squalane', 'Bisabolol', 'Camellia Seed Oil'],
    instructions: 'Melt away daily urban pollutants and SPF without disturbing the delicate acid mantle.',
    frequency: 'Daily evening',
    matchedProductSku: 'AURA-CLN-05'
  },
  {
    phase: 'PM',
    stepNumber: 2,
    category: 'Clinical Overnight Treatment',
    name: 'Bakuchiol & Resveratrol Cellular Restorative Elixir',
    activeIngredients: ['Bakuchiol 1%', 'Resveratrol 2%', 'Blue Tansy Oil'],
    instructions: 'Gentle retinol-alternative to refine texture and stimulate cell renewal overnight with zero redness.',
    frequency: '3-4 nights per week',
    matchedProductSku: 'AURA-TRT-06'
  },
  {
    phase: 'PM',
    stepNumber: 3,
    category: 'Lipid Recovery Balm',
    name: 'Ceramide Omega Barrier Repair Cream',
    activeIngredients: ['Ceramides 1, 3, 6-II', 'Phytosphingosine', 'Shea Butter Ester'],
    instructions: 'Warm between fingertips and gently press into cheeks to lock in barrier hydration.',
    frequency: 'Daily evening',
    matchedProductSku: 'AURA-BLM-07'
  }
];

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Velvet Berry Noir Lip Pigment',
    brand: 'AuraSense Atelier',
    category: 'Lip Color',
    price: 36.00,
    rating: 4.9,
    reviewsCount: 382,
    image: '/src/assets/images/product_lipstick_1793112138981.jpg',
    description: 'A decadent velvet satin lip formulation enriched with wild blackberry seed oil and hyaluronic spheres for all-day comfort without feathering.',
    shadeName: 'Velvet Berry',
    shadeHex: '#9E3248',
    activeIngredients: ['Blackberry Seed Oil', 'Hyaluronic Acid Spheres', 'Vitamin E'],
    targetConcerns: ['Lip Dryness', 'Longwear Pigment'],
    matchReason: 'Calibrated for your evening occasion and olive-toned complexion.',
    checkoutUrl: 'https://aurasense.beauty/checkout?sku=AURA-LIP-01',
    bodyFitRationale: 'Bold lip anchor balances waist-focused wrap tailoring and open necklines.'
  },
  {
    id: 'prod-2',
    name: 'Centella & Multi-Hyaluronic Calming Serum',
    brand: 'AuraSense Clinical',
    category: 'Serums',
    price: 58.00,
    rating: 4.8,
    reviewsCount: 512,
    image: '/src/assets/images/product_serum_1793112139457.jpg',
    description: 'High-potency calming serum formulated with 72% fermented Centella Asiatica and 5 weights of hyaluronic acid to rapidly quench redness.',
    activeIngredients: ['Centella Asiatica Extract', 'Pentavitin', 'Allantoin'],
    targetConcerns: ['Cheek Redness', 'Deep Dehydration'],
    matchReason: 'Directly addresses your 58/100 Erythema score and wind exposure sensitivity.',
    checkoutUrl: 'https://aurasense.beauty/checkout?sku=AURA-SRM-02'
  },
  {
    id: 'prod-3',
    name: 'Terracotta Sunset Matte Lip Velour',
    brand: 'AuraSense Atelier',
    category: 'Lip Color',
    price: 34.00,
    rating: 4.7,
    reviewsCount: 228,
    image: '/src/assets/images/product_lipstick_1793112138981.jpg',
    description: 'Warm earthy bronze pigment that warms up medium and deep undertones with a featherlight velvet cushion feel.',
    shadeName: 'Terracotta Sunset',
    shadeHex: '#C2593F',
    activeIngredients: ['Marula Oil', 'Candelilla Wax', 'Kaolin Silk'],
    targetConcerns: ['Warm Tone Definition'],
    matchReason: 'Harmonizes with warm amber lighting and Fitzpatrick III olive undertones.',
    checkoutUrl: 'https://aurasense.beauty/checkout?sku=AURA-LIP-03',
    bodyFitRationale: 'Earthy tone complements warm cashmere and leather apparel.'
  },
  {
    id: 'prod-4',
    name: 'Barrier Shield Restorative Ceramide Cream',
    brand: 'AuraSense Clinical',
    category: 'Moisturizers',
    price: 64.00,
    rating: 4.9,
    reviewsCount: 421,
    image: '/src/assets/images/product_skincare_set_1793112139919.jpg',
    description: 'Restores the epidermal lipid matrix with identical 3:1:1 physiological ratio of ceramides, cholesterol, and fatty acids.',
    activeIngredients: ['5 Essential Ceramides', 'Free Fatty Acids', 'Colloidal Oatmeal'],
    targetConcerns: ['Damaged Barrier', 'Stinging & Tightness'],
    matchReason: 'Essential remedy for your 58/100 redness metric and wind/weather exposure.',
    checkoutUrl: 'https://aurasense.beauty/checkout?sku=AURA-CRM-03'
  },
  {
    id: 'prod-5',
    name: 'Silk Slip Wrap Dress in Terracotta',
    brand: 'AuraSense Couture',
    category: 'Apparel & Styling',
    price: 185.00,
    rating: 4.95,
    reviewsCount: 164,
    image: '/src/assets/images/product_skincare_set_1793112139919.jpg',
    description: 'Bias-cut mulberry silk wrap dress with contoured waist sash and fluid A-line drape engineered for hourglass & pear proportions.',
    activeIngredients: ['100% Grade 6A Mulberry Silk', 'Self-Tie Waist Contouring'],
    targetConcerns: ['Waist Tapering', 'Occasion Elegance'],
    matchReason: 'Directly tailored to your Hourglass waist-hip ratio and wedding evening intake.',
    checkoutUrl: 'https://aurasense.beauty/checkout?sku=AURA-DRS-05',
    bodyFitRationale: 'Flattering bias-cut contours the tapered waistline while allowing graceful movement.'
  }
];

export const VTO_SHADES = {
  lipsticks: [
    { id: 'lip-1', name: 'Velvet Berry', hex: '#9E3248', desc: 'Deep refined berry' },
    { id: 'lip-2', name: 'Terracotta Sunset', hex: '#C2593F', desc: 'Warm earthy bronze' },
    { id: 'lip-3', name: 'Nude Petal', hex: '#D68C85', desc: 'Soft everyday rose' },
    { id: 'lip-4', name: 'Coral Glow', hex: '#E06553', desc: 'Vibrant fresh coral' },
    { id: 'lip-5', name: 'Royal Plum', hex: '#682239', desc: 'Rich dramatic couture' }
  ],
  blushes: [
    { id: 'bls-1', name: 'Peach Blossom', hex: '#F49D85', desc: 'Warm radiant peach' },
    { id: 'bls-2', name: 'Desert Bronze', hex: '#C07358', desc: 'Sculpted sunlit warmth' },
    { id: 'bls-3', name: 'Rose Dust', hex: '#E17B8A', desc: 'Gentle romantic pink' }
  ],
  eyeshadows: [
    { id: 'eye-1', name: 'Warm Bronze', hex: '#5A382E', desc: 'Luminous earth bronze' },
    { id: 'eye-2', name: 'Rose Gold Shimmer', hex: '#BA7D6E', desc: 'Radiant champagne rose' },
    { id: 'eye-3', name: 'Smoked Espresso', hex: '#2B1D1A', desc: 'Deep definition matte' },
    { id: 'eye-4', name: 'Champagne Pearl', hex: '#C8A892', desc: 'Soft reflective highlight' }
  ],
  finishes: [
    { id: 'dewy', name: 'Dewy Radiance', desc: 'Glass-skin glow with moisture reflection' },
    { id: 'matte', name: 'Velvet Matte', desc: 'Soft-focus blurring with zero shine' },
    { id: 'satin', name: 'Satin Silk', desc: 'Natural balanced demi-matte luminosity' }
  ]
};

// 360 degree model viewpoints
export const MODEL_ANGLES = [
  {
    angle: 0,
    label: 'Front View',
    sublabel: 'Full Face Symmetry',
    image: '/src/assets/images/model_front_view_1793112138563.jpg'
  },
  {
    angle: 45,
    label: '45° Profile',
    sublabel: 'Cheekbone & Jaw Highlight',
    image: '/src/assets/images/model_profile_45_1793112140020.jpg'
  },
  {
    angle: 90,
    label: '90° Side View',
    sublabel: 'Ear & Jawline Definition',
    image: '/src/assets/images/model_profile_90_1793112140328.jpg'
  },
  {
    angle: 180,
    label: '180° Back / Hair',
    sublabel: 'Hair Styling & Neckline',
    image: '/src/assets/images/model_back_hair_1793112140752.jpg'
  },
  {
    angle: 270,
    label: '270° Right Profile',
    sublabel: 'Right Side Contour',
    image: '/src/assets/images/model_profile_90_1793112140328.jpg',
    flip: true
  },
  {
    angle: 315,
    label: '315° Right 3/4',
    sublabel: 'Three-Quarter Angle',
    image: '/src/assets/images/model_profile_45_1793112140020.jpg',
    flip: true
  }
];

// 360 Full Body Viewpoints (Head-to-Toe Silhouette & Wardrobe Fit)
export const FULL_BODY_MODEL_ANGLES = [
  {
    angle: 0,
    label: 'Front Body (0°)',
    sublabel: 'Full Silhouette & Bodice',
    image: '/src/assets/images/body_model_front_1793197977587.jpg'
  },
  {
    angle: 45,
    label: '45° Angle',
    sublabel: 'Three-Quarter Silhouette',
    image: '/src/assets/images/body_model_angle_45_1793197977182.jpg'
  },
  {
    angle: 90,
    label: '90° Side Profile',
    sublabel: 'Posture & Side Drape',
    image: '/src/assets/images/body_model_profile_90_1793197991907.jpg'
  },
  {
    angle: 180,
    label: '180° Back View',
    sublabel: 'Back Cut & Hemline Sweep',
    image: '/src/assets/images/body_model_back_180_1793197991464.jpg'
  },
  {
    angle: 270,
    label: '270° Right Profile',
    sublabel: 'Contour Silhouette',
    image: '/src/assets/images/body_model_profile_90_1793197991907.jpg',
    flip: true
  },
  {
    angle: 315,
    label: '315° Right 3/4',
    sublabel: 'Right Three-Quarter',
    image: '/src/assets/images/body_model_angle_45_1793197977182.jpg',
    flip: true
  }
];

export const APPAREL_CATALOG: ApparelItem[] = [
  {
    id: 'apparel-wrap-gown',
    name: 'Atelier Mulberry Silk Wrap Gown',
    brand: 'AuraSense Atelier',
    category: 'Evening Couture',
    price: 185.00,
    rating: 4.96,
    reviewsCount: 214,
    image: '/src/assets/images/apparel_silk_wrap_dress_1793198016283.jpg',
    description: 'Architectural bias-cut Grade 6A mulberry silk wrap gown featuring a contoured self-tie waist sash, graceful cowl neckline, and fluid movement skirt calibrated for natural body contours.',
    colorName: 'Warm Terracotta',
    colorHex: '#C2593F',
    availableColors: [
      { name: 'Warm Terracotta', hex: '#C2593F' },
      { name: 'Obsidian Noir', hex: '#1E293B' },
      { name: 'Emerald Silk', hex: '#164E43' },
      { name: 'Champagne Gold', hex: '#D4AF37' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    fabricType: 'Grade 6A Mulberry Silk (22 Momme)',
    highlights: [
      'Self-tie sash contours waistline without restrictive compression',
      'Fluid bias-cut drape skims over hip curves effortlessly',
      'Floor-sweeping length with subtle side slit for elegant stride'
    ],
    stylingTips: 'Pair with warm gold earrings and Velvet Berry Noir lip pigment for evening galas.',
    compatibleBodyShapes: [
      {
        shape: 'Hourglass',
        matchScore: 98,
        verdict: 'Exceptional Match — Bias cut and cinched waist sash naturally follow your balanced hourglass curves.',
        fitAnalysis: {
          shoulders: 'Soft drape frames collarbones without widening',
          waist: 'Sash cinches at narrowest point for clean definition',
          hips: 'Bias cut skims over hips without cling or pull',
          length: 'Full floor length with fluid drape across ankles'
        }
      },
      {
        shape: 'Pear',
        matchScore: 92,
        verdict: 'Flattering Fit — Cowl neckline draws visual attention upward while fluid skirt glides over hips effortlessly.',
        fitAnalysis: {
          shoulders: 'Pleated cowl expands upper chest line gracefully',
          waist: 'High-waisted wrap emphasizes narrow upper torso',
          hips: 'Generous flare provides non-restrictive hip freedom',
          length: 'Streamlined vertical flow visually lengthens legs'
        }
      },
      {
        shape: 'Elongated Tall',
        matchScore: 95,
        verdict: 'Statuesque Match — Floor-sweeping silk drape elongates your vertical silhouette without truncation.',
        fitAnalysis: {
          shoulders: 'Broad stance accommodates statuesque upper torso',
          waist: 'Adjustable sash anchors proportion harmoniously',
          hips: 'Extended drop line prevents premature pooling',
          length: 'Tailored specifically for tall proportions'
        }
      },
      {
        shape: 'Rectangle',
        matchScore: 89,
        verdict: 'Creates Contours — Diagonal wrap front and belted sash construct dynamic waistline illusion.',
        fitAnalysis: {
          shoulders: 'Softens athletic symmetry with asymmetric drape',
          waist: 'Belted tie builds visually cinched waist focal point',
          hips: 'Flared lower hem creates hour-glass curvature illusion',
          length: 'Continuous clean column line'
        }
      },
      {
        shape: 'Inverted Triangle',
        matchScore: 87,
        verdict: 'Harmonizing — Full flowing skirt adds visual weight below to balance sculpted shoulders.',
        fitAnalysis: {
          shoulders: 'Deep V-neck softens broad shoulder line',
          waist: 'Contoured tie draws eyes down toward the center',
          hips: 'Voluminous hemline balances upper torso architecture',
          length: 'Graceful drape down to floor'
        }
      },
      {
        shape: 'Apple',
        matchScore: 85,
        verdict: 'Graceful Column — Fasten sash at empire line for an uninterrupted, columnar slimming drape.',
        fitAnalysis: {
          shoulders: 'Open neckline flatters bustline and neck',
          waist: 'Higher empire tie avoids midsection tightness',
          hips: 'Free-falling silk skims smoothly over stomach',
          length: 'Vertical flow creates uninterrupted height'
        }
      }
    ],
    modelAngles: [
      {
        angle: 0,
        label: 'Front View (0°)',
        sublabel: 'Mulberry Silk Wrap Bodice',
        image: '/src/assets/images/model_gown_front_1793199285409.jpg'
      },
      {
        angle: 45,
        label: '45° Angle',
        sublabel: 'Fluid Silk Drape & Sash',
        image: '/src/assets/images/model_gown_angle_45_1793199285416.jpg'
      },
      {
        angle: 90,
        label: '90° Side View',
        sublabel: 'Waist Cinch & Silhouette',
        image: '/src/assets/images/model_gown_profile_90_1793199309827.jpg'
      },
      {
        angle: 180,
        label: '180° Back View',
        sublabel: 'Rear Drape & Hemline Flow',
        image: '/src/assets/images/model_gown_back_180_1793199309958.jpg'
      },
      {
        angle: 270,
        label: '270° Right Profile',
        sublabel: 'Right Side Contour',
        image: '/src/assets/images/model_gown_profile_90_1793199309827.jpg',
        flip: true
      },
      {
        angle: 315,
        label: '315° Right 3/4',
        sublabel: 'Right Three-Quarter',
        image: '/src/assets/images/model_gown_angle_45_1793199285416.jpg',
        flip: true
      }
    ]
  },
  {
    id: 'apparel-tailored-suit',
    name: 'Savile Double-Breasted Wool Trouser Suit',
    brand: 'AuraSense Atelier',
    category: 'Tailored Suiting',
    price: 245.00,
    rating: 4.92,
    reviewsCount: 178,
    image: '/src/assets/images/apparel_tailored_suit_1793198016443.jpg',
    description: 'Sculpted double-breasted camel wool blazer with peaked lapels paired with high-waisted wide-leg pleated trousers engineered for commanding architectural elegance.',
    colorName: 'Cashmere Camel',
    colorHex: '#B8860B',
    availableColors: [
      { name: 'Cashmere Camel', hex: '#B8860B' },
      { name: 'Midnight Charcoal', hex: '#1F2937' },
      { name: 'Ivory Crepe', hex: '#E5E7EB' },
      { name: 'Deep Espresso', hex: '#3B2F2F' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    fabricType: 'Italian Worsted Virgin Wool & Cupro Lining',
    highlights: [
      'Peaked architectural lapels create strong, elongated vertical presence',
      'High-waisted double-pleat trousers lengthen leg line dramatically',
      'Tapered waist darting delivers sharp silhouette structure'
    ],
    stylingTips: 'Pair with minimalist nude lip and smoked bronze eyeshadow for sharp daytime executive styling.',
    compatibleBodyShapes: [
      {
        shape: 'Inverted Triangle',
        matchScore: 97,
        verdict: 'Architectural Balance — Peaked lapels frame shoulders while wide-leg pleated trousers create proportional equilibrium.',
        fitAnalysis: {
          shoulders: 'Unpadded soft shoulder drop honors natural width',
          waist: 'Subtle internal darting sculpts midsection',
          hips: 'Double pleats add structured volume to lower half',
          length: 'Slight puddle hem balances upper body weight'
        }
      },
      {
        shape: 'Rectangle',
        matchScore: 95,
        verdict: 'Structured Silhouette — Tailored waist darting builds strong architectural shape on athletic frames.',
        fitAnalysis: {
          shoulders: 'Sharp shoulders establish upper corner definition',
          waist: 'Hourglass button stance cuts inward at waist',
          hips: 'High rise waistband creates definitive lower curve',
          length: 'Longline architecture adds presence'
        }
      },
      {
        shape: 'Hourglass',
        matchScore: 92,
        verdict: 'Tailored Polish — Button stance cinches at the natural waist; custom sizing accommodates waist-to-hip ratio.',
        fitAnalysis: {
          shoulders: 'Clean alignment follows natural shoulder width',
          waist: 'Double-breasted wrap highlights narrow waist',
          hips: 'Generous rise prevents waistband gaping at back',
          length: 'Floor skimming trouser break'
        }
      },
      {
        shape: 'Elongated Tall',
        matchScore: 98,
        verdict: 'Commanding Fit — Generous trouser length and structured lapels celebrate statuesque height.',
        fitAnalysis: {
          shoulders: 'Proportional lapel width for statuesque frame',
          waist: 'Natural waist placement aligns accurately',
          hips: 'Pleated trousers drape cleanly without pooling',
          length: '34-inch inseam accommodates long leg silhouette'
        }
      },
      {
        shape: 'Pear',
        matchScore: 86,
        verdict: 'Balanced Frame — Peaked lapels visually broaden upper frame to equalize fuller hips.',
        fitAnalysis: {
          shoulders: 'Broad lapels lift visual focal point upward',
          waist: 'Can be tailored at back waist for zero gap',
          hips: 'Wide-leg trousers flow straight down from hip crest',
          length: 'Vertical creases extend line downward'
        }
      },
      {
        shape: 'Apple',
        matchScore: 83,
        verdict: 'Vertical Lengthening — Wear open with unbuttoned front to create sleek dual vertical lines.',
        fitAnalysis: {
          shoulders: 'Structured shoulders define clean frame',
          waist: 'Unbuttoned drape skims over midsection comfortably',
          hips: 'High rise trousers support abdomen smoothly',
          length: 'Continuous unbroken vertical flow'
        }
      }
    ],
    modelAngles: [
      {
        angle: 0,
        label: 'Front View (0°)',
        sublabel: 'Double-Breasted Wool Blazer',
        image: '/src/assets/images/model_suit_front_1793199220988.jpg'
      },
      {
        angle: 45,
        label: '45° Angle',
        sublabel: 'Peaked Lapel & Wide-Leg Trouser',
        image: '/src/assets/images/model_suit_angle_45_1793199221648.jpg'
      },
      {
        angle: 90,
        label: '90° Side View',
        sublabel: 'Tailored Posture & Pleat Line',
        image: '/src/assets/images/model_suit_profile_90_1793199236361.jpg'
      },
      {
        angle: 180,
        label: '180° Back View',
        sublabel: 'Shoulder Architecture & Trouser Break',
        image: '/src/assets/images/model_suit_back_180_1793199236289.jpg'
      },
      {
        angle: 270,
        label: '270° Right Profile',
        sublabel: 'Right Profile Tailoring',
        image: '/src/assets/images/model_suit_profile_90_1793199236361.jpg',
        flip: true
      },
      {
        angle: 315,
        label: '315° Right 3/4',
        sublabel: 'Right Three-Quarter',
        image: '/src/assets/images/model_suit_angle_45_1793199221648.jpg',
        flip: true
      }
    ]
  },
  {
    id: 'apparel-cashmere-trench',
    name: 'Architectural Belted Cashmere Trench',
    brand: 'AuraSense Atelier',
    category: 'Luxury Outerwear',
    price: 320.00,
    rating: 4.98,
    reviewsCount: 142,
    image: '/src/assets/images/apparel_cashmere_trench_1793198029982.jpg',
    description: 'Heavyweight brushed cashmere-wool blend trench with storm flaps, belted waist cinch, deep welt pockets, and gunmetal hardware crafted for all-weather luxury.',
    colorName: 'Dark Olive Obsidian',
    colorHex: '#3D4A3E',
    availableColors: [
      { name: 'Dark Olive Obsidian', hex: '#3D4A3E' },
      { name: 'Cognac Saddle', hex: '#8B4513' },
      { name: 'Onyx Noir', hex: '#111827' },
      { name: 'Warm Greige', hex: '#9CA3AF' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    fabricType: 'Double-Faced Cashmere-Wool Blend (70% Wool, 30% Cashmere)',
    highlights: [
      'Contoured leather-wrapped belt cinches waist with custom tension',
      'Generous storm shield flap adds textural and architectural interest',
      'Floor-sweeping duster length keeps entire outfit protected and warm'
    ],
    stylingTips: 'Tie belt firmly in front or loop behind for a loose, draped open-front Parisian silhouette.',
    compatibleBodyShapes: [
      {
        shape: 'Hourglass',
        matchScore: 97,
        verdict: 'Iconic Cinch — Belted waist accentuates your natural waistline while the tailored skirt falls gracefully.',
        fitAnalysis: {
          shoulders: 'Raglan shoulder seam sits cleanly without bulk',
          waist: 'Belt cinches tightly at natural waistline',
          hips: 'Flared skirt hem floats over hips with freedom',
          length: 'Mid-calf drape completes hourglass proportions'
        }
      },
      {
        shape: 'Elongated Tall',
        matchScore: 99,
        verdict: 'Masterpiece Proportion — Longline silhouette falls past the calf, framing tall silhouettes with authority.',
        fitAnalysis: {
          shoulders: 'Extended sleeve length fits tall arm proportions',
          waist: 'Lower belt loops align with elongated torso',
          hips: 'Deep side vents allow effortless stride',
          length: 'Generous 50-inch length celebrates statuesque height'
        }
      },
      {
        shape: 'Pear',
        matchScore: 93,
        verdict: 'Balanced Volume — Storm flaps and collar detail add upper interest while A-line skirt drapes cleanly over hips.',
        fitAnalysis: {
          shoulders: 'Storm flaps add intentional volume to upper frame',
          waist: 'Cinching belt highlights trim waist',
          hips: 'Full A-line flare prevents any pull across hips',
          length: 'Elongates lower frame seamlessly'
        }
      },
      {
        shape: 'Rectangle',
        matchScore: 93,
        verdict: 'Dimensional Contours — Outerwear layers and belted waist create dynamic curvature.',
        fitAnalysis: {
          shoulders: 'Epaulettes create crisp shoulder angles',
          waist: 'Cinching transforms straight torso into curved shape',
          hips: 'Flared bottom panels generate lower volume',
          length: 'Dramatically frames entire height'
        }
      },
      {
        shape: 'Inverted Triangle',
        matchScore: 90,
        verdict: 'Fluid Movement — Belt creates waist focal point while flared hem softens shoulder width.',
        fitAnalysis: {
          shoulders: 'Raglan cut softens broad shoulders smoothly',
          waist: 'Tied sash draws attention to the narrow waist',
          hips: 'Wide skirt flare balances upper frame geometry',
          length: 'Flowing hemline softens overall look'
        }
      },
      {
        shape: 'Apple',
        matchScore: 89,
        verdict: 'Vertical Column — Tie belt loosely at back for a sleek open duster line that elongates.',
        fitAnalysis: {
          shoulders: 'Deep lapels create lengthening V-line down chest',
          waist: 'Back-tied belt shapes waist without squeezing front',
          hips: 'Generous drape glides past midsection effortlessly',
          length: 'Unbroken vertical frame creates slimming column'
        }
      }
    ],
    modelAngles: [
      {
        angle: 0,
        label: 'Front View (0°)',
        sublabel: 'Belted Cashmere Trench Coat',
        image: '/src/assets/images/model_trench_front_1793199251427.jpg'
      },
      {
        angle: 45,
        label: '45° Angle',
        sublabel: 'Double-Breasted Flap & Belt',
        image: '/src/assets/images/model_trench_angle_45_1793199251102.jpg'
      },
      {
        angle: 90,
        label: '90° Side View',
        sublabel: 'Profile Drape & Pocket Line',
        image: '/src/assets/images/model_trench_profile_90_1793199269769.jpg'
      },
      {
        angle: 180,
        label: '180° Back View',
        sublabel: 'Storm Flap & Deep Center Vent',
        image: '/src/assets/images/model_trench_back_180_1793199269648.jpg'
      },
      {
        angle: 270,
        label: '270° Right Profile',
        sublabel: 'Right Side Silhouette',
        image: '/src/assets/images/model_trench_profile_90_1793199269769.jpg',
        flip: true
      },
      {
        angle: 315,
        label: '315° Right 3/4',
        sublabel: 'Right Three-Quarter',
        image: '/src/assets/images/model_trench_angle_45_1793199251102.jpg',
        flip: true
      }
    ]
  }
];

export function getGarmentColorFilter(apparelId: string, colorHex: string): string {
  if (apparelId === 'apparel-wrap-gown') {
    if (colorHex === '#C2593F') return 'none'; // Terracotta original
    if (colorHex === '#1E293B') return 'grayscale(90%) brightness(78%) contrast(110%)'; // Obsidian Noir
    if (colorHex === '#164E43') return 'hue-rotate(205deg) saturate(115%) brightness(90%)'; // Emerald Silk
    if (colorHex === '#D4AF37') return 'hue-rotate(335deg) saturate(135%) brightness(105%)'; // Champagne Gold
  }
  if (apparelId === 'apparel-tailored-suit') {
    if (colorHex === '#B8860B') return 'none'; // Cashmere Camel original
    if (colorHex === '#1F2937') return 'grayscale(95%) brightness(75%) contrast(115%)'; // Midnight Charcoal
    if (colorHex === '#E5E7EB') return 'grayscale(90%) brightness(135%) contrast(105%)'; // Ivory Crepe
    if (colorHex === '#3B2F2F') return 'hue-rotate(330deg) brightness(75%) contrast(120%)'; // Deep Espresso
  }
  if (apparelId === 'apparel-cashmere-trench') {
    if (colorHex === '#3D4A3E') return 'none'; // Dark Olive Obsidian original
    if (colorHex === '#111827') return 'grayscale(95%) brightness(70%) contrast(115%)'; // Onyx Noir
    if (colorHex === '#8B4513') return 'hue-rotate(40deg) saturate(140%) brightness(105%)'; // Cognac Saddle
    if (colorHex === '#9CA3AF') return 'grayscale(80%) brightness(120%) contrast(100%)'; // Warm Greige
  }
  return 'none';
}


