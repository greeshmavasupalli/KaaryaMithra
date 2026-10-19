import React from 'react';

/**
 * KaaryaMithra Brand Logo
 * Combines:
 * 1. The Interlocking Handshake of Trust & Solidarity ("Mithra")
 * 2. The Craftsman's Precision Skill Gear ("Kaarya")
 * 3. The Golden Spark & Compass of Opportunity & Excellence
 */
export const KaaryaMithraLogo = ({
  size = 40,
  showText = true,
  showTagline = true,
  className = '',
  textColor = 'text-slate-900',
  taglineColor = 'text-teal-700',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Iconic Vector Emblem */}
      <div
        className="relative flex-shrink-0 group cursor-pointer"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Teal to Emerald Gradient */}
            <linearGradient id="kmTealGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F766E" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Radiant Saffron Gold Gradient */}
            <linearGradient id="kmGoldGrad" x1="20" y1="80" x2="80" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>

            {/* Spark Glow Filter */}
            <filter id="kmSparkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#F59E0B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Rounded Shield / Circle */}
          <rect width="100" height="100" rx="26" fill="#F0FDFA" />
          <rect width="98" height="98" x="1" y="1" rx="25" stroke="#CCFBF1" strokeWidth="2" />

          {/* 1. Craftsman Gear (Kaarya - Skill & Craft) */}
          <g transform="translate(50, 48)">
            <path
              d="M-7,-28 L7,-28 L6,-22 C10,-20 14,-17 18,-14 L23,-18 L32,-9 L28,-4 C31,0 32,5 33,10 L39,11 L39,23 L33,24 C31,29 29,33 26,37 L29,43 L20,50 L15,45 C11,48 6,49 1,50 L0,56 L-12,56 L-13,50 C-18,49 -23,47 -27,44 L-32,48 L-40,40 L-36,35 C-39,31 -41,27 -42,22 L-48,21 L-48,9 L-42,8 C-41,3 -39,-2 -36,-6 L-40,-11 L-32,-19 L-27,-15 C-23,-18 -18,-21 -13,-23 L-12,-29 Z"
              fill="url(#kmTealGrad)"
              opacity="0.18"
              transform="scale(0.55)"
            />
          </g>

          {/* 2. Upper Handshake Arc (Teal - Mithra / Trust & Platform Companion) */}
          <path
            d="M32 24 C42 16, 62 16, 74 25 C82 31, 85 41, 84 50 C83 55, 78 58, 73 56 C68 54, 66 48, 67 43 C68 37, 65 31, 59 28 C53 25, 43 25, 36 30 C31 34, 25 32, 24 27 C23 23, 27 21, 32 24 Z"
            fill="url(#kmTealGrad)"
          />

          {/* 3. Lower Handshake Clasp (Saffron Gold - Skilled Worker Empowerment) */}
          <path
            d="M68 76 C58 84, 38 84, 26 75 C18 69, 15 59, 16 50 C17 45, 22 42, 27 44 C32 46, 34 52, 33 57 C32 63, 35 69, 41 72 C47 75, 57 75, 64 70 C69 66, 75 68, 76 73 C77 77, 73 79, 68 76 Z"
            fill="url(#kmGoldGrad)"
          />

          {/* 4. Clasping Fingers Silhouette */}
          <path
            d="M44 48 C41 44, 46 38, 52 42 C57 45, 61 48, 64 45 C67 42, 70 45, 67 49 C64 54, 58 59, 52 56 C47 54, 46 51, 44 48 Z"
            fill="url(#kmTealGrad)"
          />
          <path
            d="M56 52 C59 56, 54 62, 48 58 C43 55, 39 52, 36 55 C33 58, 30 55, 33 51 C36 46, 42 41, 48 44 C53 46, 54 49, 56 52 Z"
            fill="url(#kmGoldGrad)"
          />

          {/* 5. Center Precision Gear Ring */}
          <circle cx="50" cy="50" r="16" stroke="url(#kmTealGrad)" strokeWidth="3.5" strokeDasharray="5 3" />

          {/* 6. Dynamic Star / Spark of Opportunity */}
          <g filter="url(#kmSparkGlow)">
            {/* Compass / Star Rays */}
            <path
              d="M50 22 L53 43 L74 46 L55 51 L58 72 L47 55 L26 52 L45 47 Z"
              fill="url(#kmGoldGrad)"
            />
            {/* Spark Center Core */}
            <circle cx="50" cy="49" r="4.5" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.8" />
            <circle cx="50" cy="49" r="2" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight font-sans">
            <span className={textColor}>Kaarya</span>
            <span className="text-teal-600">Mithra</span>
          </div>
          {showTagline && (
            <span className={`text-[11px] font-bold ${taglineColor} -mt-0.5 tracking-wide uppercase`}>
              Your work your skill
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default KaaryaMithraLogo;
