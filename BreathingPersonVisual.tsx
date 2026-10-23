import React from 'react';

interface BreathingPersonVisualProps {
  phase: 'Inhale' | 'Hold' | 'Exhale' | 'Rest';
  progress: number; // 0 to 1 progress within the current phase
  secondsLeft: number;
}

export const BreathingPersonVisual: React.FC<BreathingPersonVisualProps> = ({
  phase,
  progress,
  secondsLeft,
}) => {
  const isInhale = phase === 'Inhale';
  const isHold = phase === 'Hold';
  const isExhale = phase === 'Exhale';
  const isRest = phase === 'Rest';

  // Chest expansion factor: 1.0 (baseline) to 1.14 (fully inhaled)
  let chestScale = 1.0;
  if (isInhale) {
    chestScale = 1.0 + progress * 0.14;
  } else if (isHold) {
    chestScale = 1.14;
  } else if (isExhale) {
    chestScale = 1.14 - progress * 0.14;
  } else {
    chestScale = 1.0;
  }

  // Color schemes for mood / phase
  const getPhaseColors = () => {
    switch (phase) {
      case 'Inhale':
        return {
          glow: 'rgba(20, 184, 166, 0.35)', // teal
          accent: '#0d9488',
          bgGradientFrom: '#0f766e',
          bgGradientTo: '#14b8a6',
          badgeText: 'text-teal-700',
          badgeBg: 'bg-teal-50',
          badgeBorder: 'border-teal-200',
        };
      case 'Hold':
        return {
          glow: 'rgba(56, 189, 248, 0.4)', // cyan/sky
          accent: '#0284c7',
          bgGradientFrom: '#0369a1',
          bgGradientTo: '#38bdf8',
          badgeText: 'text-sky-700',
          badgeBg: 'bg-sky-50',
          badgeBorder: 'border-sky-200',
        };
      case 'Exhale':
        return {
          glow: 'rgba(99, 102, 241, 0.35)', // indigo
          accent: '#4f46e5',
          bgGradientFrom: '#4338ca',
          bgGradientTo: '#818cf8',
          badgeText: 'text-indigo-700',
          badgeBg: 'bg-indigo-50',
          badgeBorder: 'border-indigo-200',
        };
      case 'Rest':
      default:
        return {
          glow: 'rgba(16, 185, 129, 0.3)', // emerald
          accent: '#059669',
          bgGradientFrom: '#047857',
          bgGradientTo: '#34d399',
          badgeText: 'text-emerald-700',
          badgeBg: 'bg-emerald-50',
          badgeBorder: 'border-emerald-200',
        };
    }
  };

  const colors = getPhaseColors();

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none py-2">
      {/* Dynamic Background Radiance / Breathing Orb behind the figure */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-out -z-10 pointer-events-none"
        style={{
          width: `${190 + (chestScale - 1) * 220}px`,
          height: `${190 + (chestScale - 1) * 220}px`,
          background: `radial-gradient(circle, ${colors.glow} 0%, rgba(255, 255, 255, 0) 70%)`,
          filter: 'blur(16px)',
        }}
      />

      {/* SVG Canvas with Animated Meditating Person & Air Flow */}
      <div className="relative w-72 h-64 sm:w-80 sm:h-72 flex items-center justify-center">
        <svg
          viewBox="0 0 320 280"
          className="w-full h-full drop-shadow-sm overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="breathSkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="breathTorsoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.bgGradientTo} />
              <stop offset="100%" stopColor={colors.bgGradientFrom} />
            </linearGradient>

            <linearGradient id="breathLegsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <filter id="breathGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Mat / Grounding Ring */}
          <ellipse
            cx="160"
            cy="245"
            rx="110"
            ry="22"
            fill="#e2e8f0"
            opacity="0.8"
          />
          <ellipse
            cx="160"
            cy="245"
            rx="85"
            ry="14"
            fill="#cbd5e1"
            opacity="0.6"
          />

          {/* Aura Rings pulsing around meditating body */}
          <circle
            cx="160"
            cy="130"
            r={65 + (chestScale - 1) * 70}
            fill="none"
            stroke={colors.accent}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity={0.3 + (chestScale - 1) * 1.5}
            className="transition-all duration-700 ease-out"
          />

          {/* AIR FLOW PARTICLES & ARROWS */}
          {/* INHALE ARROWS (Flowing upward into the nostrils and chest) */}
          {isInhale && (
            <g className="animate-pulse" opacity="0.85">
              <path
                d="M 125 105 Q 140 85 155 78"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
              />
              <polygon points="158,74 151,80 156,83" fill={colors.accent} />

              <path
                d="M 195 105 Q 180 85 165 78"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
              />
              <polygon points="162,74 164,83 169,80" fill={colors.accent} />

              {/* Expansion Indicators */}
              <path
                d="M 115 135 L 98 135"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="94,135 100,131 100,139" fill={colors.accent} />

              <path
                d="M 205 135 L 222 135"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="226,135 220,131 220,139" fill={colors.accent} />
            </g>
          )}

          {/* EXHALE ARROWS (Flowing softly downward releasing tension) */}
          {isExhale && (
            <g className="animate-pulse" opacity="0.85">
              <path
                d="M 156 82 Q 145 98 135 110"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
              <polygon points="131,114 139,110 134,106" fill={colors.accent} />

              <path
                d="M 164 82 Q 175 98 185 110"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="5 3"
              />
              <polygon points="189,114 186,106 181,110" fill={colors.accent} />

              {/* Release Arrows Inward */}
              <path
                d="M 98 135 L 115 135"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="119,135 113,131 113,139" fill={colors.accent} />

              <path
                d="M 222 135 L 205 135"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <polygon points="201,135 207,131 207,139" fill={colors.accent} />
            </g>
          )}

          {/* HOLD RINGS (Serene stillness) */}
          {isHold && (
            <g opacity="0.75">
              <circle
                cx="160"
                cy="135"
                r="38"
                fill="none"
                stroke={colors.accent}
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <circle
                cx="160"
                cy="60"
                r="18"
                fill="none"
                stroke={colors.accent}
                strokeWidth="1.5"
                opacity="0.5"
              />
            </g>
          )}

          {/* Crossed Legs Base */}
          <g>
            {/* Left folded thigh */}
            <path
              d="M 130 190 Q 90 205 75 225 Q 95 242 160 240 Z"
              fill="url(#breathLegsGrad)"
            />
            {/* Right folded thigh */}
            <path
              d="M 190 190 Q 230 205 245 225 Q 225 242 160 240 Z"
              fill="url(#breathLegsGrad)"
            />
            {/* Knees and ankles fold */}
            <ellipse cx="85" cy="225" rx="18" ry="12" fill="#334155" />
            <ellipse cx="235" cy="225" rx="18" ry="12" fill="#334155" />
            <ellipse cx="160" cy="235" rx="35" ry="12" fill="#1e293b" />
          </g>

          {/* DYNAMIC TORSO & CHEST (Transforms smoothly with chestScale) */}
          <g
            transform={`translate(160, 150) scale(${chestScale}) translate(-160, -150)`}
            className="transition-transform duration-500 ease-out"
          >
            {/* Main Torso */}
            <path
              d="M 134 110 Q 120 135 125 190 L 195 190 Q 200 135 186 110 Z"
              fill="url(#breathTorsoGrad)"
              filter="url(#breathGlowFilter)"
            />

            {/* Diaphragm / Lungs Core Light */}
            <ellipse
              cx="160"
              cy="142"
              rx={16 + (chestScale - 1) * 35}
              ry={18 + (chestScale - 1) * 40}
              fill="#ffffff"
              opacity={0.35 + (chestScale - 1) * 1.5}
            />

            {/* Gentle neckline */}
            <path
              d="M 148 110 Q 160 120 172 110"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.6"
            />
          </g>

          {/* Neck */}
          <rect
            x="153"
            y="88"
            width="14"
            height="18"
            rx="4"
            fill="#fed7aa"
          />

          {/* Head */}
          <ellipse
            cx="160"
            cy="65"
            rx="20"
            ry="24"
            fill="#fed7aa"
          />

          {/* Hair / Headband (clean modern aesthetic) */}
          <path
            d="M 140 62 Q 160 38 180 62 Q 180 46 160 44 Q 140 46 140 62 Z"
            fill="#1e293b"
          />
          {/* Subtle Top Bun / Hair Knot */}
          <circle cx="160" cy="40" r="8" fill="#1e293b" />

          {/* Serene Closed Eyes (gentle curves showing calm relaxation) */}
          <path
            d="M 150 66 Q 154 70 157 66"
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 163 66 Q 166 70 170 66"
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Gentle resting smile */}
          <path
            d="M 156 77 Q 160 80 164 77"
            fill="none"
            stroke="#475569"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Arms resting softly on knees with Chin Mudra */}
          {/* Left Arm */}
          <path
            d="M 132 115 Q 105 145 92 210"
            fill="none"
            stroke="#334155"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Left Hand on knee with Mudra */}
          <circle cx="90" cy="216" r="7" fill="#fed7aa" />
          <circle cx="88" cy="213" r="3" fill="#f59e0b" opacity="0.6" />

          {/* Right Arm */}
          <path
            d="M 188 115 Q 215 145 228 210"
            fill="none"
            stroke="#334155"
            strokeWidth="13"
            strokeLinecap="round"
          />
          {/* Right Hand on knee with Mudra */}
          <circle cx="230" cy="216" r="7" fill="#fed7aa" />
          <circle cx="232" cy="213" r="3" fill="#f59e0b" opacity="0.6" />
        </svg>
      </div>

      {/* Visual State & Countdown Indicator Pill */}
      <div className="mt-1 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition-colors ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
        >
          <span
            className="inline-block h-2 w-2 rounded-full animate-ping"
            style={{ backgroundColor: colors.accent }}
          />
          {phase.toUpperCase()}: {secondsLeft}s
        </span>

        <span className="text-xs text-slate-500 font-medium">
          {isInhale && 'Expanding lungs & abdomen'}
          {isHold && 'Resting in still awareness'}
          {isExhale && 'Releasing tension with breath'}
          {isRest && 'Resetting calm center'}
        </span>
      </div>
    </div>
  );
};
