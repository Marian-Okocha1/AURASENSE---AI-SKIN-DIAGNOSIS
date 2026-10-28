import { LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  // Global Major Languages
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English (United States)',
    region: 'North America',
    speechCode: 'en-US',
    flag: '🇺🇸',
    samplePhrase: 'Attending an outdoor evening wedding, experiencing dry cheeks and mild redness.'
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (United Kingdom)',
    region: 'Europe',
    speechCode: 'en-GB',
    flag: '🇬🇧',
    samplePhrase: 'Attending a corporate gala in London with dry winter skin and fine smile lines.'
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    region: 'Europe / Francophonie',
    speechCode: 'fr-FR',
    flag: '🇫🇷',
    samplePhrase: 'Soirée élégante ce week-end, peau déshydratée et cernes sous les yeux.'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain / Latin America',
    speechCode: 'es-ES',
    flag: '🇪🇸',
    samplePhrase: 'Reunión de gala al aire libre, busco acabado luminoso y alivio para rojeces.'
  },
  {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'Middle East / North Africa',
    speechCode: 'ar-SA',
    flag: '🇸🇦',
    samplePhrase: 'مناسبة خاصة في المساء، أعاني من جفاف البشرة حول العينين واحمرار خفيف.',
    rtl: true
  },
  {
    code: 'pt-BR',
    name: 'Portuguese',
    nativeName: 'Português (Brasil)',
    region: 'South America / Europe',
    speechCode: 'pt-BR',
    flag: '🇧🇷',
    samplePhrase: 'Casamento à tarde na praia, pele sensível com tendência a ressecamento e brilho na zona T.'
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Europe',
    speechCode: 'de-DE',
    flag: '🇩🇪',
    samplePhrase: 'Gala-Abendveranstaltung, empfindliche und trockene Haut bei kühlem Wetter.'
  },
  {
    code: 'zh-CN',
    name: 'Mandarin Chinese',
    nativeName: '简体中文 (Mandarin)',
    region: 'Asia',
    speechCode: 'zh-CN',
    flag: '🇨🇳',
    samplePhrase: '周末出席晚宴，眼周有些干燥细纹，面颊有轻微泛红，希望妆容服帖自然。'
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'South Asia',
    speechCode: 'hi-IN',
    flag: '🇮🇳',
    samplePhrase: 'शाम के पारिवारिक समारोह के लिए, शुष्क त्वचा और हल्के लालिमा के लिए उपचार और मैचिंग शेड चाहिए।'
  },
  {
    code: 'ur-PK',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'South Asia',
    speechCode: 'ur-PK',
    flag: '🇵🇰',
    samplePhrase: 'شام کی تقریب کے لیے خشک جلد اور چہرے پر ہلکی سرخی کے لیے موزوں سکن کئیر اور میک اپ چاہیے۔',
    rtl: true
  },

  // Regional African Languages
  {
    code: 'wo-SN',
    name: 'Wolof',
    nativeName: 'Wolof (Senegal / Gambia)',
    region: 'West Africa',
    speechCode: 'wo-SN',
    flag: '🇸🇳',
    samplePhrase: 'Dama am ngente ci ngoon gi, sama yaram dafa wow te am na ay xonq ci xar-kanam yi.'
  },
  {
    code: 'mnk',
    name: 'Mandinka',
    nativeName: 'Mandiŋka kango',
    region: 'West Africa',
    speechCode: 'en-US',
    flag: '🇬🇲',
    samplePhrase: 'N be taa la kumoo la suuto, n koto janna le, a ye xonqo nina.'
  },
  {
    code: 'ha-NG',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    region: 'West / Central Africa',
    speechCode: 'ha-NG',
    flag: '🇳🇬',
    samplePhrase: 'Ina da taro da daddare, fuskata tana da bushewa da kuma ɗan ja a kumatu.'
  },
  {
    code: 'yo-NG',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    region: 'West Africa',
    speechCode: 'yo-NG',
    flag: '🇳🇬',
    samplePhrase: 'Mo ní ayẹyẹ ìrọ̀lẹ́ kan, ojú mi gbẹ díẹ̀ pẹ̀lú pupa lẹ́gbẹ̀ẹ́ ẹ̀rẹ̀kẹ́ mi.'
  },
  {
    code: 'ig-NG',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    region: 'West Africa',
    speechCode: 'ig-NG',
    flag: '🇳🇬',
    samplePhrase: 'Enwere m mmemme n’abalị a, anụ ahụ ihu m akpọnwụwo ma nwee ntakịrị mgbakasị.'
  },
  {
    code: 'sw-KE',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    region: 'East Africa',
    speechCode: 'sw-KE',
    flag: '🇰🇪',
    samplePhrase: 'Nina hafla ya jioni, ngozi yangu imekauka kidogo na ina wekundu kwenye mashavu.'
  },
  {
    code: 'pcm-NG',
    name: 'Nigerian Pidgin',
    nativeName: 'Naija Pidgin',
    region: 'West Africa',
    speechCode: 'en-NG',
    flag: '🇳🇬',
    samplePhrase: 'I get wedding party this evening, my face dey dry and cheeks dey red small.'
  },
  {
    code: 'ff',
    name: 'Fulani',
    nativeName: 'Fulfulde / Pulaar',
    region: 'Sahel & West Africa',
    speechCode: 'fr-FR',
    flag: '🌍',
    samplePhrase: 'Miɗo yaha fiyake jamma, nguru am ɓoornii ko yoori e woɗɗere nder galle.'
  }
];
