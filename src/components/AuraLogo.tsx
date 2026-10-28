import React from 'react';

interface AuraLogoProps {
  className?: string;
  size?: number;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Electric Cyan to Vivid Violet Radiant Aura Gradient */}
        <linearGradient id="auraGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>

        <linearGradient id="faceOutlineGrad" x1="0%" y1="20%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>

        <filter id="auraGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Radiant Fashion Aura Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#auraGlowGrad)"
        strokeWidth="2.5"
        strokeDasharray="4 2"
        opacity="0.75"
      />

      {/* Outer Pulse Wave */}
      <path
        d="M 22 50 C 22 34.5 34.5 22 50 22 C 65.5 22 78 34.5 78 50 C 78 65.5 65.5 78 50 78"
        stroke="url(#auraGlowGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Stylized Face Silhouette Profile */}
      <path
        d="M 44 26 C 54 26 62 31 62 40 C 62 44 59 47 57 49 C 55.5 50.5 56 53 58 54 C 61 55.5 63 58 63 61 C 63 66 58 72 50 74 C 42 76 34 72 32 64"
        stroke="url(#faceOutlineGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#auraGlowFilter)"
      />

      {/* Delicate Eye & Brow Accent */}
      <path
        d="M 46 38 C 49 37 53 38 55 41"
        stroke="#22d3ee"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="44" r="1.8" fill="#a855f7" />

      {/* Interwoven Radiant AI Sparkle Star (Vivid Violet & Cyan) */}
      <path
        d="M 68 32 C 68 36 72 36 72 36 C 72 36 68 36 68 40 C 68 36 64 36 64 36 C 64 36 68 36 68 32 Z"
        fill="#06b6d4"
      />
      <circle cx="68" cy="36" r="1.5" fill="#FFFFFF" />

      {/* Subtle Micro Sparkles */}
      <circle cx="28" cy="42" r="1.2" fill="#8b5cf6" opacity="0.85" />
      <circle cx="72" cy="62" r="1.2" fill="#06b6d4" opacity="0.85" />
    </svg>
  );
};
