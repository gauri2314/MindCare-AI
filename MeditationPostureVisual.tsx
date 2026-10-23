import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Shield,
  Compass,
  ArrowUp,
  ArrowDown,
  Wind,
  Heart,
  Eye,
  Activity,
} from 'lucide-react';

interface MeditationPostureVisualProps {
  poseKey: string;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  instruction: string;
  postureCues?: string[];
  keyAlignment?: string;
  bodyHighlight?: string;
  themeColor?: 'teal' | 'indigo' | 'purple' | 'blue' | 'emerald' | 'amber';
  // Breathing synchronization props
  breathPhase?: 'Inhale' | 'Hold' | 'Exhale' | 'Rest';
  breathProgress?: number; // 0 to 1
  secondsLeft?: number;
  isBreathingActive?: boolean;
  className?: string;
}

export const MeditationPostureVisual: React.FC<MeditationPostureVisualProps> = ({
  poseKey,
  stepNumber,
  totalSteps,
  stepTitle,
  instruction,
  postureCues = ['Straight spine', 'Relax shoulders', 'Hands on thighs', 'Breathe slowly'],
  keyAlignment,
  bodyHighlight,
  themeColor = 'teal',
  breathPhase = 'Inhale',
  breathProgress = 0.5,
  secondsLeft = 4,
  isBreathingActive = false,
  className = '',
}) => {
  // Theme color mapping
  const getThemePalette = () => {
    switch (themeColor) {
      case 'indigo':
        return {
          shirt: '#4f46e5',
          shirtShade: '#4338ca',
          glow: 'rgba(99, 102, 241, 0.28)',
          accent: '#6366f1',
          bgBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'purple':
        return {
          shirt: '#7c3aed',
          shirtShade: '#6d28d9',
          glow: 'rgba(168, 85, 247, 0.28)',
          accent: '#a855f7',
          bgBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'blue':
        return {
          shirt: '#2563eb',
          shirtShade: '#1d4ed8',
          glow: 'rgba(59, 130, 246, 0.28)',
          accent: '#3b82f6',
          bgBadge: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'emerald':
        return {
          shirt: '#059669',
          shirtShade: '#047857',
          glow: 'rgba(16, 185, 129, 0.28)',
          accent: '#10b981',
          bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'amber':
        return {
          shirt: '#d97706',
          shirtShade: '#b45309',
          glow: 'rgba(245, 158, 11, 0.28)',
          accent: '#f59e0b',
          bgBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      case 'teal':
      default:
        return {
          shirt: '#0d9488',
          shirtShade: '#0f766e',
          glow: 'rgba(20, 184, 166, 0.28)',
          accent: '#14b8a6',
          bgBadge: 'bg-teal-50 text-teal-700 border-teal-200',
        };
    }
  };

  const palette = getThemePalette();

  // Dynamic chest scale based on breathing phase
  let chestExpansion = 1.0;
  if (isBreathingActive) {
    if (breathPhase === 'Inhale') {
      chestExpansion = 1.0 + breathProgress * 0.12;
    } else if (breathPhase === 'Hold') {
      chestExpansion = 1.12;
    } else if (breathPhase === 'Exhale') {
      chestExpansion = 1.12 - breathProgress * 0.12;
    } else {
      chestExpansion = 1.0;
    }
  }

  // Renders the specific human posture illustration SVG
  const renderPostureFigure = () => {
    switch (poseKey) {
      // 1. SEATED ON CHAIR - COMFORTABLE (Feet grounded, relaxed spine)
      case 'seated-chair-comfortable':
      case 'chair-prep':
        return (
          <g id="seated-chair-comfortable">
            {/* Ground shadow */}
            <ellipse cx="230" cy="380" rx="95" ry="12" fill="#cbd5e1" opacity="0.6" />

            {/* Chair outline (minimalist ergonomic chair) */}
            <path
              d="M175 160 L175 295 L175 375 M175 295 L265 295 L265 375 M210 295 L210 375"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Chair Backrest pad */}
            <rect x="168" y="165" width="12" height="110" rx="6" fill="#64748b" />
            {/* Chair Seat cushion */}
            <rect x="165" y="288" width="105" height="12" rx="4" fill="#64748b" />

            {/* Head */}
            <circle cx="225" cy="115" r="22" fill="#f6c29b" />
            {/* Hair */}
            <path
              d="M207 115 C207 96 243 96 243 115 C243 103 235 97 225 97 C215 97 207 103 207 115 Z"
              fill="#1e293b"
            />

            {/* Torso - seated with natural upright spine */}
            <path
              d="M208 140 L242 140 L245 235 L205 235 Z"
              fill={palette.shirt}
              rx="8"
            />
            {/* Torso contour */}
            <path
              d="M218 140 L232 140 L230 235 L220 235 Z"
              fill={palette.shirtShade}
              opacity="0.35"
            />

            {/* Upper Arm down along body */}
            <path
              d="M212 148 L202 205 L235 240"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Arm */}
            <path
              d="M238 148 L248 205 L245 240"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Hands resting on thighs */}
            <circle cx="236" cy="242" r="7" fill="#fed7aa" />
            <circle cx="246" cy="242" r="7" fill="#e2a77a" />

            {/* Pelvis & Hips on chair */}
            <path d="M202 235 L248 235 L252 290 L198 290 Z" fill="#334155" />

            {/* Thighs horizontal on chair cushion (90 deg) */}
            <path
              d="M204 285 L268 285"
              stroke="#334155"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M210 275 L270 275"
              stroke="#475569"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Calves vertical down to floor (90 deg) */}
            <line
              x1="262"
              y1="285"
              x2="262"
              y2="370"
              stroke="#f6c29b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <line
              x1="274"
              y1="285"
              x2="274"
              y2="370"
              stroke="#e2a77a"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Feet flat on floor */}
            <path
              d="M255 370 L285 370 L285 380 L250 380 Z"
              fill="#ffffff"
              stroke="#0d9488"
              strokeWidth="2.5"
            />
            <path
              d="M268 370 L298 370 L298 380 L263 380 Z"
              fill="#ffffff"
              stroke="#0d9488"
              strokeWidth="2.5"
            />

            {/* Subtle alignment cues */}
            <line
              x1="225"
              y1="130"
              x2="225"
              y2="240"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <g transform="translate(130, 220)">
              <text x="0" y="0" fill="#0284c7" fontSize="10" fontWeight="bold">
                Spine relaxed
              </text>
            </g>
            <g transform="translate(295, 345)">
              <text x="0" y="0" fill="#0d9488" fontSize="10" fontWeight="bold">
                Feet flat
              </text>
            </g>
          </g>
        );

      // 2. SEATED ON CHAIR - UPRIGHT WITH CHEST & SPINE CUES
      case 'seated-chair-upright':
        return (
          <g id="seated-chair-upright">
            <ellipse cx="230" cy="380" rx="95" ry="12" fill="#cbd5e1" opacity="0.6" />

            {/* Minimalist Chair */}
            <path
              d="M175 160 L175 295 L175 375 M175 295 L265 295 L265 375 M210 295 L210 375"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="168" y="165" width="12" height="110" rx="6" fill="#64748b" />
            <rect x="165" y="288" width="105" height="12" rx="4" fill="#64748b" />

            {/* Head positioned effortlessly over spine */}
            <circle cx="225" cy="112" r="22" fill="#f6c29b" />
            <path
              d="M207 112 C207 93 243 93 243 112 C243 100 235 94 225 94 C215 94 207 100 207 112 Z"
              fill="#1e293b"
            />

            {/* Torso upright and elongated */}
            <path
              d="M208 136 L242 136 L245 235 L205 235 Z"
              fill={palette.shirt}
              rx="8"
            />
            <path
              d="M218 136 L232 136 L230 235 L220 235 Z"
              fill={palette.shirtShade}
              opacity="0.35"
            />

            {/* Arms resting symmetrically */}
            <path
              d="M210 144 L200 200 L235 240"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M240 144 L250 200 L245 240"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            <circle cx="236" cy="242" r="7" fill="#fed7aa" />
            <circle cx="246" cy="242" r="7" fill="#e2a77a" />

            {/* Hips & Legs */}
            <path d="M202 235 L248 235 L252 290 L198 290 Z" fill="#334155" />
            <path
              d="M204 285 L268 285"
              stroke="#334155"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <line
              x1="262"
              y1="285"
              x2="262"
              y2="370"
              stroke="#f6c29b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <line
              x1="274"
              y1="285"
              x2="274"
              y2="370"
              stroke="#e2a77a"
              strokeWidth="14"
              strokeLinecap="round"
            />

            <path
              d="M255 370 L285 370 L285 380 L250 380 Z"
              fill="#ffffff"
              stroke="#0d9488"
              strokeWidth="2.5"
            />

            {/* Upright spine arrow indicator */}
            <line
              x1="225"
              y1="125"
              x2="225"
              y2="230"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <path
              d="M225 105 L225 90 M221 95 L225 88 L229 95"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="235" y="93" fill="#0284c7" fontSize="10" fontWeight="bold">
              ↑ Lengthen crown
            </text>

            {/* Shoulder drop indicators */}
            <path
              d="M198 145 L198 158 M195 154 L198 160 L201 154"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M252 145 L252 158 M249 154 L252 160 L255 154"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text x="260" y="156" fill="#047857" fontSize="9" fontWeight="bold">
              ↓ Relax shoulders
            </text>
          </g>
        );

      // 3. SEATED CROSS-LEGGED / FLOOR CUSHION (Standard Mindful Breathing Posture)
      case 'seated-crosslegged-prep':
      case 'seated-crosslegged':
      case 'seated-upright-spine':
      case 'seated-eyes-closed':
        return (
          <g id="seated-crosslegged-figure">
            {/* Ground shadow & Meditation Cushion (Zafu) */}
            <ellipse cx="220" cy="365" rx="100" ry="16" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="220" cy="335" rx="60" ry="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <path
              d="M160 335 C160 350 280 350 280 335 L280 348 C280 363 160 363 160 348 Z"
              fill="#cbd5e1"
            />

            {/* Head */}
            <circle cx="220" cy="115" r="23" fill="#f6c29b" />
            {/* Hair */}
            <path
              d="M201 115 C201 95 239 95 239 115 C239 102 231 96 220 96 C209 96 201 102 201 115 Z"
              fill="#1e293b"
            />

            {/* Closed Eyes line indicator */}
            {poseKey === 'seated-eyes-closed' && (
              <g>
                <path d="M211 118 Q215 121 219 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M222 118 Q226 121 230 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M217 127 Q220 129 223 127" stroke="#e2a77a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Torso - Upright spinal column */}
            <path
              d="M202 142 L238 142 L244 245 L196 245 Z"
              fill={palette.shirt}
              rx="8"
            />
            {/* Center spine shadow */}
            <path
              d="M214 142 L226 142 L224 245 L216 245 Z"
              fill={palette.shirtShade}
              opacity="0.3"
            />

            {/* Arms extending smoothly to knees */}
            <path
              d="M202 150 Q178 200 170 270"
              stroke="#f6c29b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M238 150 Q262 200 270 270"
              stroke="#f6c29b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            {/* Hands resting on knees with Mudra */}
            <circle cx="170" cy="272" r="8" fill="#fed7aa" />
            <circle cx="172" cy="269" r="3.5" fill="#f59e0b" opacity="0.6" />
            <circle cx="270" cy="272" r="8" fill="#fed7aa" />
            <circle cx="268" cy="269" r="3.5" fill="#f59e0b" opacity="0.6" />

            {/* Pelvis */}
            <path d="M192 245 L248 245 L252 285 L188 285 Z" fill="#334155" />

            {/* Cross-legged thigh folds (Sukhasana) */}
            {/* Left Knee fold */}
            <path
              d="M195 270 Q160 275 160 300 Q160 330 220 335"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="2"
            />
            {/* Right Knee fold */}
            <path
              d="M245 270 Q280 275 280 300 Q280 330 220 335"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Folded Ankles / Bare Feet */}
            <ellipse cx="205" cy="335" rx="14" ry="8" fill="#fed7aa" />
            <ellipse cx="235" cy="335" rx="14" ry="8" fill="#e2a77a" />

            {/* Alignment Guideline: Straight Spine */}
            <line
              x1="220"
              y1="130"
              x2="220"
              y2="245"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            {/* Posture Cues embedded in SVG */}
            <g transform="translate(245, 180)">
              <text x="0" y="0" fill="#0284c7" fontSize="10" fontWeight="bold">
                Spine erect
              </text>
            </g>
            <g transform="translate(130, 160)">
              <text x="0" y="0" fill="#059669" fontSize="9" fontWeight="bold">
                Soft shoulders
              </text>
            </g>
            <g transform="translate(285, 275)">
              <text x="0" y="0" fill="#d97706" fontSize="9" fontWeight="bold">
                Hands on knees
              </text>
            </g>
          </g>
        );

      // 4. SEATED BREATHING CHEST & DIAPHRAGM
      case 'seated-breathing-chest':
      case 'seated-breathing':
      case 'focus-breath':
        return (
          <g id="seated-breathing-figure">
            <ellipse cx="220" cy="365" rx="100" ry="16" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="220" cy="335" rx="60" ry="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            {/* Dynamic Chest & Breathing Aura around Torso */}
            <ellipse
              cx="220"
              cy="185"
              rx={48 * chestExpansion}
              ry={52 * chestExpansion}
              fill={palette.glow}
              filter="blur(10px)"
            />

            {/* Head */}
            <circle cx="220" cy="115" r="23" fill="#f6c29b" />
            <path
              d="M201 115 C201 95 239 95 239 115 C239 102 231 96 220 96 C209 96 201 102 201 115 Z"
              fill="#1e293b"
            />

            {/* Soft closed eyes in meditation */}
            <path d="M211 118 Q215 121 219 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M222 118 Q226 121 230 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Torso with subtle expansion */}
            <g transform={`translate(${220 * (1 - chestExpansion)}, ${185 * (1 - chestExpansion)}) scale(${chestExpansion})`}>
              <path
                d="M202 142 L238 142 L244 245 L196 245 Z"
                fill={palette.shirt}
                rx="8"
              />
              <path
                d="M214 142 L226 142 L224 245 L216 245 Z"
                fill={palette.shirtShade}
                opacity="0.3"
              />

              {/* Lungs / Breathing Pulse Contour */}
              <circle cx="212" cy="175" r="14" fill="#ffffff" opacity="0.3" />
              <circle cx="228" cy="175" r="14" fill="#ffffff" opacity="0.3" />
            </g>

            {/* Arms resting on knees */}
            <path
              d="M202 150 Q178 200 170 270"
              stroke="#f6c29b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M238 150 Q262 200 270 270"
              stroke="#f6c29b"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            <circle cx="170" cy="272" r="8" fill="#fed7aa" />
            <circle cx="270" cy="272" r="8" fill="#fed7aa" />

            {/* Legs folded */}
            <path d="M192 245 L248 245 L252 285 L188 285 Z" fill="#334155" />
            <path
              d="M195 270 Q160 275 160 300 Q160 330 220 335"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M245 270 Q280 275 280 300 Q280 330 220 335"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Breathing Phase Callout in SVG */}
            <g transform="translate(140, 75)">
              <rect x="0" y="0" width="160" height="26" rx="13" fill="#ffffff" stroke={palette.accent} strokeWidth="1.5" />
              <text x="80" y="17" textAnchor="middle" fill="#0f766e" fontSize="11" fontWeight="bold">
                {breathPhase.toUpperCase()} • {secondsLeft}s
              </text>
            </g>

            {/* Expansion wave lines */}
            <path
              d="M175 185 Q180 180 185 185"
              stroke={palette.accent}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M265 185 Q260 180 255 185"
              stroke={palette.accent}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );

      // 5. SEATED WITH HAND ON HEART (Gratitude, Self-Compassion)
      case 'seated-hand-on-heart':
      case 'gratitude-heart':
        return (
          <g id="seated-hand-on-heart">
            <ellipse cx="220" cy="365" rx="100" ry="16" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="220" cy="335" rx="60" ry="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            {/* Soft Warm Heart Radiance */}
            <circle cx="220" cy="180" r="32" fill="rgba(245, 158, 11, 0.25)" filter="blur(8px)" />

            {/* Head */}
            <circle cx="220" cy="115" r="23" fill="#f6c29b" />
            <path
              d="M201 115 C201 95 239 95 239 115 C239 102 231 96 220 96 C209 96 201 102 201 115 Z"
              fill="#1e293b"
            />
            {/* Gentle serene smile */}
            <path d="M211 118 Q215 121 219 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M222 118 Q226 121 230 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M216 126 Q220 129 224 126" stroke="#e2a77a" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Torso */}
            <path
              d="M202 142 L238 142 L244 245 L196 245 Z"
              fill={palette.shirt}
              rx="8"
            />

            {/* Arms placed tenderly over heart center */}
            {/* Left Arm bending to chest */}
            <path
              d="M202 150 L190 200 L218 185"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Right Arm crossing over */}
            <path
              d="M238 150 L250 200 L224 182"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Hands cupping heart center */}
            <circle cx="220" cy="182" r="10" fill="#fed7aa" />
            <path
              d="M215 178 C215 174 219 174 220 176 C221 174 225 174 225 178 C225 183 220 186 220 186 C220 186 215 183 215 178 Z"
              fill="#f59e0b"
            />

            {/* Folded legs */}
            <path d="M192 245 L248 245 L252 285 L188 285 Z" fill="#334155" />
            <path
              d="M195 270 Q160 275 160 300 Q160 330 220 335"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M245 270 Q280 275 280 300 Q280 330 220 335"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Posture Cues */}
            <g transform="translate(255, 175)">
              <text x="0" y="0" fill="#d97706" fontSize="10" fontWeight="bold">
                Hands on heart
              </text>
            </g>
            <g transform="translate(130, 210)">
              <text x="0" y="0" fill="#0284c7" fontSize="9" fontWeight="bold">
                Feel warmth
              </text>
            </g>
          </g>
        );

      // 6. SEATED WITH HAND ON BELLY (Diaphragmatic Breath)
      case 'seated-hand-on-belly':
      case 'belly-breath':
        return (
          <g id="seated-hand-on-belly">
            <ellipse cx="220" cy="365" rx="100" ry="16" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="220" cy="335" rx="60" ry="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            <circle cx="220" cy="115" r="23" fill="#f6c29b" />
            <path
              d="M201 115 C201 95 239 95 239 115 C239 102 231 96 220 96 C209 96 201 102 201 115 Z"
              fill="#1e293b"
            />

            {/* Torso */}
            <path
              d="M202 142 L238 142 L244 245 L196 245 Z"
              fill={palette.shirt}
              rx="8"
            />

            {/* One hand on chest, one on lower abdomen */}
            <path
              d="M202 150 L188 190 L216 180"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M238 150 L252 205 L224 225"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            <circle cx="218" cy="180" r="7" fill="#fed7aa" />
            <circle cx="222" cy="225" r="8" fill="#e2a77a" />

            {/* Belly expansion circle indicator */}
            <circle cx="220" cy="225" r="16" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />

            <path d="M192 245 L248 245 L252 285 L188 285 Z" fill="#334155" />
            <path
              d="M195 270 Q160 275 160 300 Q160 330 220 335"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M245 270 Q280 275 280 300 Q280 330 220 335"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="2"
            />

            <g transform="translate(255, 230)">
              <text x="0" y="0" fill="#059669" fontSize="9" fontWeight="bold">
                Hand on belly
              </text>
            </g>
          </g>
        );

      // 7. LYING DOWN - SUPINE / SAVASANA (Sleep Meditation, Body Scan, Deep Rest)
      case 'lying-supine-savasana':
      case 'sleep-rest':
      case 'body-scan-lying':
        return (
          <g id="lying-supine-savasana">
            {/* Mat / Bed surface */}
            <rect x="50" y="275" width="340" height="18" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            {/* Floor shadow */}
            <ellipse cx="220" cy="305" rx="160" ry="14" fill="#cbd5e1" opacity="0.6" />

            {/* Pillow under head */}
            <rect x="65" y="245" width="45" height="28" rx="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />

            {/* Head resting horizontally on pillow */}
            <circle cx="85" cy="245" r="19" fill="#f6c29b" />
            {/* Hair */}
            <path
              d="M68 245 C68 230 102 230 102 245 C102 235 95 230 85 230 C75 230 68 235 68 245 Z"
              fill="#1e293b"
            />
            {/* Closed eye */}
            <path d="M82 242 Q86 245 90 242" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Torso horizontal */}
            <path
              d="M106 242 L195 242 L195 272 L106 272 Z"
              fill={palette.shirt}
              rx="6"
            />

            {/* Dynamic breath glow on chest while lying down */}
            {isBreathingActive && (
              <ellipse
                cx="145"
                cy="255"
                rx={32 * chestExpansion}
                ry={22 * chestExpansion}
                fill={palette.glow}
                filter="blur(6px)"
              />
            )}

            {/* Arms resting by side, palms turned upward */}
            <path
              d="M112 248 L170 262 L198 266"
              stroke="#f6c29b"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="202" cy="266" r="6" fill="#fed7aa" />

            {/* Hips / Shorts */}
            <path d="M195 242 L245 242 L245 274 L195 274 Z" fill="#334155" rx="4" />

            {/* Legs extended long and heavy */}
            {/* Thighs */}
            <line
              x1="245"
              y1="258"
              x2="305"
              y2="260"
              stroke="#f6c29b"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Calves */}
            <line
              x1="305"
              y1="260"
              x2="355"
              y2="264"
              stroke="#e2a77a"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Feet naturally falling open outward */}
            <ellipse cx="365" cy="265" rx="8" ry="14" fill="#fed7aa" transform="rotate(25 365 265)" />

            {/* Soft blanket / twilight aura over body */}
            <line
              x1="100"
              y1="230"
              x2="370"
              y2="230"
              stroke="#6366f1"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Posture Cues in SVG */}
            <g transform="translate(110, 215)">
              <text x="0" y="0" fill="#4f46e5" fontSize="10" fontWeight="bold">
                Spine flat & supported
              </text>
            </g>
            <g transform="translate(290, 215)">
              <text x="0" y="0" fill="#0d9488" fontSize="10" fontWeight="bold">
                Feet roll open
              </text>
            </g>
            <g transform="translate(210, 290)">
              <text x="0" y="0" fill="#64748b" fontSize="9" fontWeight="bold">
                Palms facing up
              </text>
            </g>
          </g>
        );

      // 8. LYING DOWN WITH SOMATIC BODY SCAN LIGHT BEAM
      case 'lying-body-scan-sweep':
      case 'body-scan-sweep':
        return (
          <g id="lying-body-scan-sweep">
            <rect x="50" y="275" width="340" height="18" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
            <ellipse cx="220" cy="305" rx="160" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="65" y="245" width="45" height="28" rx="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />

            <circle cx="85" cy="245" r="19" fill="#f6c29b" />
            <path
              d="M68 245 C68 230 102 230 102 245 C102 235 95 230 85 230 C75 230 68 235 68 245 Z"
              fill="#1e293b"
            />
            <path d="M82 242 Q86 245 90 242" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Torso horizontal */}
            <path
              d="M106 242 L195 242 L195 272 L106 272 Z"
              fill={palette.shirt}
              rx="6"
            />
            <path
              d="M112 248 L170 262 L198 266"
              stroke="#f6c29b"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="202" cy="266" r="6" fill="#fed7aa" />

            <path d="M195 242 L245 242 L245 274 L195 274 Z" fill="#334155" rx="4" />
            <line x1="245" y1="258" x2="305" y2="260" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" />
            <line x1="305" y1="260" x2="355" y2="264" stroke="#e2a77a" strokeWidth="12" strokeLinecap="round" />
            <ellipse cx="365" cy="265" rx="8" ry="14" fill="#fed7aa" transform="rotate(25 365 265)" />

            {/* Vertical Somatic Scanner Ring that sweeps across body */}
            <g transform={`translate(${100 + (breathProgress * 230)}, 0)`}>
              <ellipse cx="0" cy="256" rx="14" ry="38" fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeDasharray="3 2" />
              <ellipse cx="0" cy="256" rx="6" ry="24" fill="rgba(20, 184, 166, 0.25)" filter="blur(4px)" />
              <text x="0" y="205" textAnchor="middle" fill="#0d9488" fontSize="9" fontWeight="bold">
                Scanning
              </text>
            </g>
          </g>
        );

      // 9. STANDING MINDFULNESS / MOUNTAIN POSE (Tadasana)
      case 'standing-mindful':
      case 'standing-mountain':
        return (
          <g id="standing-mindful-figure">
            <ellipse cx="220" cy="380" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />

            {/* Head upright */}
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path
              d="M202 105 C202 87 238 87 238 105 C238 95 230 89 220 89 C210 89 202 95 202 105 Z"
              fill="#1e293b"
            />

            {/* Torso standing tall and balanced */}
            <path
              d="M204 128 L236 128 L240 220 L200 220 Z"
              fill={palette.shirt}
              rx="8"
            />
            <path
              d="M214 128 L226 128 L224 220 L216 220 Z"
              fill={palette.shirtShade}
              opacity="0.35"
            />

            {/* Arms resting naturally at sides, fingertips pointed down */}
            <line
              x1="203"
              y1="135"
              x2="190"
              y2="215"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="190" cy="218" r="6" fill="#fed7aa" />

            <line
              x1="237"
              y1="135"
              x2="250"
              y2="215"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <circle cx="250" cy="218" r="6" fill="#fed7aa" />

            {/* Shorts */}
            <path d="M198 220 L242 220 L244 265 L196 265 Z" fill="#334155" />

            {/* Legs hip-width apart */}
            {/* Left Leg */}
            <line x1="206" y1="265" x2="206" y2="330" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="206" y1="330" x2="206" y2="375" stroke="#e2a77a" strokeWidth="13" strokeLinecap="round" />

            {/* Right Leg */}
            <line x1="234" y1="265" x2="234" y2="330" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="234" y1="330" x2="234" y2="375" stroke="#e2a77a" strokeWidth="13" strokeLinecap="round" />

            {/* Shoes/Feet grounded */}
            <path d="M194 375 L218 375 L218 383 L190 383 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M222 375 L246 375 L250 383 L222 383 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />

            {/* Alignment line from sky to earth */}
            <line
              x1="220"
              y1="75"
              x2="220"
              y2="380"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <g transform="translate(255, 140)">
              <text x="0" y="0" fill="#0284c7" fontSize="10" fontWeight="bold">
                Spine tall
              </text>
            </g>
            <g transform="translate(125, 230)">
              <text x="0" y="0" fill="#059669" fontSize="9" fontWeight="bold">
                Arms at sides
              </text>
            </g>
            <g transform="translate(260, 360)">
              <text x="0" y="0" fill="#0f766e" fontSize="9" fontWeight="bold">
                Feet grounded
              </text>
            </g>
          </g>
        );

      // 10. LOTUS / HALF-LOTUS POSTURE WITH DHYANA MUDRA (Classic Deep Meditation)
      case 'lotus-deep':
      case 'cross-legged-mudra':
      default:
        return (
          <g id="lotus-deep-figure">
            <ellipse cx="220" cy="365" rx="105" ry="16" fill="#cbd5e1" opacity="0.6" />
            <ellipse cx="220" cy="335" rx="65" ry="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            {/* Head */}
            <circle cx="220" cy="115" r="23" fill="#f6c29b" />
            <path
              d="M201 115 C201 95 239 95 239 115 C239 102 231 96 220 96 C209 96 201 102 201 115 Z"
              fill="#1e293b"
            />

            {/* Closed eyes */}
            <path d="M211 118 Q215 121 219 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M222 118 Q226 121 230 118" stroke="#334155" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Torso */}
            <path
              d="M202 142 L238 142 L244 245 L196 245 Z"
              fill={palette.shirt}
              rx="8"
            />
            <path
              d="M214 142 L226 142 L224 245 L216 245 Z"
              fill={palette.shirtShade}
              opacity="0.3"
            />

            {/* Arms resting with hands in lap (Dhyana Mudra) */}
            <path
              d="M202 150 Q180 210 205 248"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M238 150 Q260 210 235 248"
              stroke="#f6c29b"
              strokeWidth="11"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cupped hands in lap with thumbs touching */}
            <ellipse cx="220" cy="250" rx="14" ry="7" fill="#fed7aa" />
            <circle cx="220" cy="246" r="3" fill="#f59e0b" opacity="0.6" />

            {/* Folded Lotus Legs */}
            <path d="M192 245 L248 245 L252 285 L188 285 Z" fill="#334155" />
            <path
              d="M195 270 Q150 275 155 305 Q160 335 220 335"
              fill="#334155"
              stroke="#1e293b"
              strokeWidth="2"
            />
            <path
              d="M245 270 Q290 275 285 305 Q280 335 220 335"
              fill="#475569"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* Soles of feet visible in lotus */}
            <ellipse cx="195" cy="318" rx="12" ry="7" fill="#fed7aa" transform="rotate(-15 195 318)" />
            <ellipse cx="245" cy="318" rx="12" ry="7" fill="#fed7aa" transform="rotate(15 245 318)" />

            {/* Spine Alignment */}
            <line
              x1="220"
              y1="125"
              x2="220"
              y2="245"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            <g transform="translate(255, 175)">
              <text x="0" y="0" fill="#0284c7" fontSize="10" fontWeight="bold">
                Spine upright
              </text>
            </g>
            <g transform="translate(125, 230)">
              <text x="0" y="0" fill="#d97706" fontSize="9" fontWeight="bold">
                Hands in lap
              </text>
            </g>
          </g>
        );
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center w-full select-none ${className}`}>
      {/* Top Posture Header Tag & Step Progress */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
          <Compass className="h-3.5 w-3.5 text-teal-600" />
          <span>
            Step {stepNumber} of {totalSteps}: {stepTitle}
          </span>
        </span>

        {isBreathingActive && (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${palette.bgBadge}`}>
            <span
              className="inline-block h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: palette.accent }}
            />
            {breathPhase.toUpperCase()} • {secondsLeft}s
          </span>
        )}
      </div>

      {/* SVG Illustration Container */}
      <div className="relative w-full max-w-[420px] aspect-4/3 flex items-center justify-center">
        {/* Soft background aura */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none -z-10 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, ${palette.glow} 0%, rgba(255, 255, 255, 0) 70%)`,
          }}
        />

        <svg
          viewBox="0 0 440 400"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderPostureFigure()}
        </svg>
      </div>

      {/* Posture Cues Chips directly beneath illustration */}
      {postureCues && postureCues.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 px-2">
          {postureCues.map((cue, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/80"
            >
              <CheckCircle2 className="h-3 w-3 text-teal-600 shrink-0" />
              <span>{cue}</span>
            </span>
          ))}

          {keyAlignment && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
              <Shield className="h-3 w-3 text-sky-600 shrink-0" />
              <span>{keyAlignment}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
