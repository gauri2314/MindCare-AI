import React from 'react';
import { Sparkles, CheckCircle2, Shield, Info, ArrowUp, ArrowDown, ArrowRight, RotateCw, Wind } from 'lucide-react';

interface YogaPostureVisualProps {
  poseId: string;
  stepNumber: number;
  imageKey: string;
  title: string;
  instruction: string;
  motionDirection?: string;
  motionArrowLabel?: string;
  postureCue?: string;
  keyAlignment?: string;
  bodyHighlight?: string;
  breathPhase?: 'Inhale' | 'Hold' | 'Exhale' | 'Rest';
  breathProgress?: number;
  showBreathingRing?: boolean;
  className?: string;
}

export const YogaPostureVisual: React.FC<YogaPostureVisualProps> = ({
  poseId,
  stepNumber,
  imageKey,
  title,
  instruction,
  motionDirection = 'hold',
  motionArrowLabel,
  postureCue,
  keyAlignment,
  bodyHighlight,
  breathPhase,
  breathProgress = 0,
  showBreathingRing = true,
  className = '',
}) => {
  // Breathing Aura expansion scale
  let auraScale = 1.0;
  if (breathPhase === 'Inhale') {
    auraScale = 1.0 + breathProgress * 0.18;
  } else if (breathPhase === 'Hold') {
    auraScale = 1.18;
  } else if (breathPhase === 'Exhale') {
    auraScale = 1.18 - breathProgress * 0.18;
  }

  // Aura colors
  const getAuraColor = () => {
    switch (breathPhase) {
      case 'Inhale':
        return 'rgba(20, 184, 166, 0.22)';
      case 'Hold':
        return 'rgba(56, 189, 248, 0.25)';
      case 'Exhale':
        return 'rgba(99, 102, 241, 0.22)';
      default:
        return 'rgba(16, 185, 129, 0.18)';
    }
  };

  const renderYogaDummy = () => {
    switch (imageKey) {
      // ==========================================
      // 1. MOUNTAIN POSE (TADASANA)
      // ==========================================
      case 'mountain-step-1':
        // Grounding Stance
        return (
          <g id="mountain-fig-1">
            <ellipse cx="220" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Yoga Mat */}
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="220" cy="95" r="22" fill="#f6c29b" />
            <path d="M202 95 C202 77 238 77 238 95 C238 85 230 79 220 79 C210 79 202 85 202 95 Z" fill="#1e293b" />
            {/* Upright Torso */}
            <path d="M204 118 L236 118 L238 215 L202 215 Z" fill="#0d9488" rx="6" />
            {/* Arms at sides, palms turned forward */}
            <path d="M204 125 L188 185 L186 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M236 125 L252 185 L254 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="186" cy="242" r="6" fill="#e2a77a" />
            <circle cx="254" cy="242" r="6" fill="#e2a77a" />
            {/* Tights/Legs together */}
            <path d="M202 215 L238 215 L242 270 L222 270 L220 235 L218 270 L198 270 Z" fill="#334155" />
            <line x1="210" y1="270" x2="210" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="270" x2="230" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            {/* Bare feet grounded */}
            <path d="M198 375 L215 375 L215 382 L196 382 Z" fill="#e2a77a" rx="2" />
            <path d="M225 375 L242 375 L244 382 L225 382 Z" fill="#e2a77a" rx="2" />
            {/* Spinal alignment line */}
            <line x1="220" y1="95" x2="220" y2="370" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
          </g>
        );

      case 'mountain-step-2':
        // Lengthen Spine & Roll Shoulders
        return (
          <g id="mountain-fig-2">
            <ellipse cx="220" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="220" cy="90" r="22" fill="#f6c29b" />
            <path d="M202 90 C202 72 238 72 238 90 C238 80 230 74 220 74 C210 74 202 80 202 90 Z" fill="#1e293b" />
            {/* Broad chest */}
            <path d="M202 114 L238 114 L240 215 L200 215 Z" fill="#0d9488" rx="6" />
            {/* Arms relaxed and active */}
            <path d="M202 122 L184 185 L182 238" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M238 122 L256 185 L258 238" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L242 270 L222 270 L220 235 L218 270 L198 270 Z" fill="#334155" />
            <line x1="210" y1="270" x2="210" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="270" x2="230" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M198 375 L215 375 L215 382 L196 382 Z" fill="#e2a77a" />
            <path d="M225 375 L242 375 L244 382 L225 382 Z" fill="#e2a77a" />
            {/* Shoulder roll indicators */}
            <path d="M190 120 C180 115 180 135 192 135" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M250 120 C260 115 260 135 248 135" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Upward crown vector */}
            <path d="M220 68 L220 48 M215 54 L220 46 L225 54" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'mountain-step-3':
        // Upward Salute / Mountain Inhale (Urdhva Hastasana)
        return (
          <g id="mountain-fig-3">
            <ellipse cx="220" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            <path d="M204 132 L236 132 L238 225 L202 225 Z" fill="#0d9488" rx="6" />
            {/* Arms reaching overhead parallel */}
            <path d="M204 135 L195 70 L205 25" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M236 135 L245 70 L235 25" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 225 L240 225 L242 275 L222 275 L220 240 L218 275 L198 275 Z" fill="#334155" />
            <line x1="210" y1="275" x2="210" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="275" x2="230" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M198 375 L215 375 L215 382 L196 382 Z" fill="#e2a77a" />
            <path d="M225 375 L242 375 L244 382 L225 382 Z" fill="#e2a77a" />
            {/* Upward Energy arrows */}
            <g transform="translate(220, 15)">
              <path d="M0 0 L0 -10 M-4 -5 L0 -12 L4 -5" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      case 'mountain-step-4':
        // Grounded Centering Stillness
        return (
          <g id="mountain-fig-4">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="220" cy="95" r="22" fill="#f6c29b" />
            <path d="M202 95 C202 77 238 77 238 95 C238 85 230 79 220 79 C210 79 202 85 202 95 Z" fill="#1e293b" />
            <path d="M204 118 L236 118 L238 215 L202 215 Z" fill="#0d9488" rx="6" />
            {/* Hands in Anjali Mudra (Prayer at heart) */}
            <path d="M204 125 L195 170 L212 165" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M236 125 L245 170 L228 165" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="220" cy="165" r="7" fill="#e2a77a" />
            <path d="M202 215 L238 215 L242 270 L222 270 L220 235 L218 270 L198 270 Z" fill="#334155" />
            <line x1="210" y1="270" x2="210" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="270" x2="230" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M198 375 L215 375 L215 382 L196 382 Z" fill="#e2a77a" />
            <path d="M225 375 L242 375 L244 382 L225 382 Z" fill="#e2a77a" />
            {/* Heart glow */}
            <circle cx="220" cy="165" r="14" fill="#0d9488" opacity="0.25" />
          </g>
        );

      // ==========================================
      // 2. TREE POSE (VRIKSHASANA) — 5 Steps as in prompt
      // ==========================================
      case 'tree-step-1':
        // Step 1: Starting Position (Standing straight, feet together, arms relaxed)
        return (
          <g id="tree-fig-1">
            <ellipse cx="220" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="220" cy="95" r="22" fill="#f6c29b" />
            <path d="M202 95 C202 77 238 77 238 95 C238 85 230 79 220 79 C210 79 202 85 202 95 Z" fill="#1e293b" />
            <path d="M204 118 L236 118 L238 215 L202 215 Z" fill="#0d9488" rx="6" />
            <path d="M204 125 L188 185 L186 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M236 125 L252 185 L254 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M202 215 L238 215 L242 270 L222 270 L220 235 L218 270 L198 270 Z" fill="#334155" />
            <line x1="210" y1="270" x2="210" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="270" x2="230" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M198 375 L215 375 L215 382 L196 382 Z" fill="#e2a77a" />
            <path d="M225 375 L242 375 L244 382 L225 382 Z" fill="#e2a77a" />
            <line x1="220" y1="95" x2="220" y2="370" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
          </g>
        );

      case 'tree-step-2':
        // Step 2: Shift Balance (Weight shifted onto left leg, right heel lifted)
        return (
          <g id="tree-fig-2">
            <ellipse cx="210" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="215" cy="95" r="22" fill="#f6c29b" />
            <path d="M197 95 C197 77 233 77 233 95 C233 85 225 79 215 79 C205 79 197 85 197 95 Z" fill="#1e293b" />
            <path d="M200 118 L232 118 L234 215 L198 215 Z" fill="#0d9488" rx="6" />
            {/* Arms resting lightly at waist/sides for balance */}
            <path d="M200 125 L182 175 L192 205" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M232 125 L250 175 L240 205" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M198 215 L234 215 L238 270 L218 270 L215 235 L212 270 L194 270 Z" fill="#334155" />
            {/* Standing Left Leg (Firm grounded) */}
            <line x1="206" y1="270" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M194 375 L214 375 L214 382 L192 382 Z" fill="#e2a77a" />
            {/* Right Leg shifting weight - heel lifted */}
            <line x1="228" y1="270" x2="236" y2="335" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="236" y1="335" x2="234" y2="370" stroke="#e2a77a" strokeWidth="13" strokeLinecap="round" />
            <circle cx="234" cy="373" r="5" fill="#e2a77a" />
            {/* Grounding arrow on left foot */}
            <g transform="translate(170, 340)">
              <path d="M10 0 L10 25 M5 20 L10 27 L15 20" stroke="#0d9488" strokeWidth="3" fill="none" strokeLinecap="round" />
              <text x="-15" y="38" fill="#0d9488" fontSize="10" fontWeight="bold">Root Leg</text>
            </g>
          </g>
        );

      case 'tree-step-3':
        // Step 3: Place Foot (Right foot placed against inner left calf/thigh)
        return (
          <g id="tree-fig-3">
            <ellipse cx="210" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="215" cy="95" r="22" fill="#f6c29b" />
            <path d="M197 95 C197 77 233 77 233 95 C233 85 225 79 215 79 C205 79 197 85 197 95 Z" fill="#1e293b" />
            <path d="M200 118 L232 118 L234 215 L198 215 Z" fill="#0d9488" rx="6" />
            {/* Hands on hips for hip leveling */}
            <path d="M200 125 L178 165 L198 185" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M232 125 L254 165 L234 185" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M198 215 L234 215 L238 270 L218 270 L215 235 L212 270 L194 270 Z" fill="#334155" />
            {/* Left standing leg */}
            <line x1="206" y1="270" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M194 375 L214 375 L214 382 L192 382 Z" fill="#e2a77a" />
            {/* Right Bent Leg - Foot pressed to inner calf */}
            <path d="M228 268 L265 305 L216 325" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx="213" cy="326" rx="6" ry="10" fill="#e2a77a" />
            {/* Knee open arrow */}
            <g transform="translate(268, 285)">
              <path d="M0 10 C10 10 15 20 18 30 M12 28 L18 32 L22 26" stroke="#0d9488" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <text x="5" y="45" fill="#0d9488" fontSize="10" fontWeight="bold">Open Knee</text>
            </g>
          </g>
        );

      case 'tree-step-4':
        // Step 4: Raise Hands (Anjali mudra at chest, steady gaze)
        return (
          <g id="tree-fig-4">
            <ellipse cx="210" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="215" cy="95" r="22" fill="#f6c29b" />
            <path d="M197 95 C197 77 233 77 233 95 C233 85 225 79 215 79 C205 79 197 85 197 95 Z" fill="#1e293b" />
            <path d="M200 118 L232 118 L234 215 L198 215 Z" fill="#0d9488" rx="6" />
            {/* Hands prayer at heart */}
            <path d="M200 125 L188 165 L210 162" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M232 125 L244 165 L220 162" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="215" cy="162" r="7" fill="#e2a77a" />
            <path d="M198 215 L234 215 L238 270 L218 270 L215 235 L212 270 L194 270 Z" fill="#334155" />
            <line x1="206" y1="270" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M194 375 L214 375 L214 382 L192 382 Z" fill="#e2a77a" />
            <path d="M228 268 L265 305 L216 325" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx="213" cy="326" rx="6" ry="10" fill="#e2a77a" />
            {/* Upward motion arrow indicating hands floating upward */}
            <g transform="translate(215, 130)">
              <path d="M0 0 L0 -16 M-4 -10 L0 -18 L4 -10" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      case 'tree-step-5':
        // Step 5: Hold Pose (Upright spine, balanced posture, hands together above head)
        return (
          <g id="tree-fig-5">
            <ellipse cx="210" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="90" y="375" width="260" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="215" cy="115" r="22" fill="#f6c29b" />
            <path d="M197 115 C197 97 233 97 233 115 C233 105 225 99 215 99 C205 99 197 105 197 115 Z" fill="#1e293b" />
            {/* Torso */}
            <path d="M200 138 L232 138 L234 230 L198 230 Z" fill="#0d9488" rx="6" />
            {/* Arms reaching overhead in graceful prayer mudra */}
            <path d="M200 142 L185 85 L212 35" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M232 142 L245 85 L218 35" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="215" cy="33" r="8" fill="#e2a77a" />
            {/* Pelvis/Shorts */}
            <path d="M198 230 L234 230 L238 280 L218 280 L215 245 L212 280 L194 280 Z" fill="#334155" />
            {/* Standing Left Leg (Strong root) */}
            <line x1="206" y1="280" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M194 375 L214 375 L214 382 L192 382 Z" fill="#e2a77a" />
            {/* Right Bent Leg into inner thigh */}
            <path d="M228 278 L265 310 L216 330" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx="213" cy="331" rx="6" ry="10" fill="#e2a77a" />
            {/* Centerline of balance */}
            <line x1="215" y1="35" x2="206" y2="375" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            {/* Radiance sparkles */}
            <circle cx="215" cy="22" r="3" fill="#0d9488" />
            <circle cx="202" cy="30" r="2" fill="#06b6d4" />
            <circle cx="228" cy="30" r="2" fill="#06b6d4" />
          </g>
        );

      // ==========================================
      // 3. CHILD'S POSE (BALASANA)
      // ==========================================
      case 'child-step-1':
      case 'child-step-2':
      case 'child-step-3':
      case 'child-step-4':
        return (
          <g id="child-pose-fig">
            <ellipse cx="220" cy="360" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="350" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Feet tucked under hips */}
            <ellipse cx="310" cy="345" rx="16" ry="10" fill="#e2a77a" />
            {/* Hips resting on heels */}
            <path d="M270 300 Q305 320 310 345" stroke="#334155" strokeWidth="26" strokeLinecap="round" fill="none" />
            {/* Bent Legs / Thighs */}
            <line x1="240" y1="345" x2="295" y2="330" stroke="#f6c29b" strokeWidth="18" strokeLinecap="round" />
            {/* Folded Torso resting over thighs */}
            <path d="M280 295 C250 280 200 280 170 300 L160 325 L275 325 Z" fill="#0d9488" rx="12" />
            {/* Head resting on mat */}
            <circle cx="145" cy="325" r="20" fill="#f6c29b" />
            <path d="M130 325 C130 310 160 310 160 325 Z" fill="#1e293b" />
            {/* Arms extending long forward */}
            <path d="M185 295 L140 315 L85 348" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <ellipse cx="80" cy="349" rx="8" ry="5" fill="#e2a77a" />
            {/* Spine elongation indicator */}
            <path d="M275 285 Q220 270 165 290" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 3" fill="none" />
          </g>
        );

      // ==========================================
      // 4. CAT-COW FLOW (MARJARYASANA-BITILASANA)
      // ==========================================
      case 'catcow-step-1':
      case 'catcow-step-4':
        // Tabletop neutral
        return (
          <g id="catcow-fig-tabletop">
            <ellipse cx="220" cy="365" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="355" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Flat Torso */}
            <path d="M165 220 L275 220 L275 270 L165 270 Z" fill="#0d9488" rx="8" />
            {/* Head neutral */}
            <circle cx="135" cy="225" r="20" fill="#f6c29b" />
            <path d="M120 225 C120 210 150 210 150 225 Z" fill="#1e293b" />
            {/* Front Arms under shoulders */}
            <line x1="165" y1="245" x2="165" y2="355" stroke="#f6c29b" strokeWidth="13" strokeLinecap="round" />
            <path d="M158 355 L172 355 L172 360 L158 360 Z" fill="#e2a77a" />
            {/* Back Legs under hips */}
            <path d="M270 245 L270 300 L305 355" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="270" y1="300" x2="270" y2="355" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
            {/* Flat spine line */}
            <line x1="145" y1="210" x2="285" y2="210" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 3" />
          </g>
        );

      case 'catcow-step-2':
        // Cow (Bitilasana - Inhale, belly sinks, chest & tail lift)
        return (
          <g id="catcow-fig-cow">
            <ellipse cx="220" cy="365" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="355" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Dipping Torso (Cow belly down) */}
            <path d="M165 210 Q220 265 275 215 L275 275 Q220 305 165 270 Z" fill="#0d9488" />
            {/* Head lifted looking up */}
            <circle cx="130" cy="190" r="20" fill="#f6c29b" />
            <path d="M115 190 C115 175 145 175 145 190 Z" fill="#1e293b" />
            {/* Arms supporting */}
            <line x1="165" y1="230" x2="165" y2="355" stroke="#f6c29b" strokeWidth="13" strokeLinecap="round" />
            <line x1="270" y1="240" x2="270" y2="355" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
            {/* Lift arrows */}
            <g transform="translate(115, 160)">
              <path d="M10 20 L10 5 M5 10 L10 2 L15 10" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="-15" y="0" fill="#0d9488" fontSize="10" fontWeight="bold">Lift Chest</text>
            </g>
          </g>
        );

      case 'catcow-step-3':
        // Cat (Marjaryasana - Exhale, spine arches high, head tucks)
        return (
          <g id="catcow-fig-cat">
            <ellipse cx="220" cy="365" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="355" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Arched Torso (Cat spine high) */}
            <path d="M165 240 Q220 160 275 240 L275 285 Q220 220 165 285 Z" fill="#0d9488" />
            {/* Head tucked down */}
            <circle cx="140" cy="265" r="20" fill="#f6c29b" />
            <path d="M125 265 C125 250 155 250 155 265 Z" fill="#1e293b" />
            <line x1="165" y1="250" x2="165" y2="355" stroke="#f6c29b" strokeWidth="13" strokeLinecap="round" />
            <line x1="270" y1="250" x2="270" y2="355" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
            {/* Spine arch arrow */}
            <g transform="translate(220, 150)">
              <path d="M0 25 L0 5 M-5 12 L0 2 L5 12" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="-25" y="-5" fill="#6366f1" fontSize="10" fontWeight="bold">Round Spine</text>
            </g>
          </g>
        );

      // ==========================================
      // 5. COBRA POSE (BHUJANGASANA)
      // ==========================================
      case 'cobra-step-1':
      case 'cobra-step-2':
      case 'cobra-step-3':
      case 'cobra-step-4':
        return (
          <g id="cobra-fig">
            <ellipse cx="220" cy="365" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="355" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Legs long on mat */}
            <line x1="220" y1="345" x2="330" y2="352" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="200" y1="340" x2="270" y2="345" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            {/* Arched chest lifting */}
            <path d="M210 340 C175 325 150 270 145 230 C160 230 185 285 220 335 Z" fill="#0d9488" />
            {/* Head lifted with broad collarbones */}
            <circle cx="140" cy="205" r="21" fill="#f6c29b" />
            <path d="M125 205 C125 190 155 190 155 205 Z" fill="#1e293b" />
            {/* Bent arms supporting */}
            <path d="M165 255 L160 305 L140 355" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx="140" cy="355" rx="10" ry="4" fill="#e2a77a" />
            {/* Lift indicator */}
            <g transform="translate(100, 205)">
              <path d="M10 25 L10 5 M5 12 L10 2 L15 12" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="-15" y="-5" fill="#0d9488" fontSize="10" fontWeight="bold">Heart Forward</text>
            </g>
          </g>
        );

      // ==========================================
      // 6. DOWNWARD-FACING DOG (ADHO MUKHA SVANASANA)
      // ==========================================
      case 'downdog-step-1':
      case 'downdog-step-2':
      case 'downdog-step-3':
      case 'downdog-step-4':
        return (
          <g id="downdog-fig">
            <ellipse cx="220" cy="370" rx="135" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="360" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Inverted V Torso & Hips at peak */}
            <path d="M210 160 L235 175 L180 265 L160 250 Z" fill="#0d9488" rx="6" />
            <path d="M205 160 L235 175 L250 205 L215 205 Z" fill="#334155" />
            {/* Head relaxed between arms */}
            <circle cx="165" cy="270" r="19" fill="#f6c29b" />
            {/* Straight Arms pressing floor away */}
            <line x1="180" y1="240" x2="115" y2="360" stroke="#f6c29b" strokeWidth="13" strokeLinecap="round" />
            <path d="M108 360 L122 360 L122 365 L108 365 Z" fill="#e2a77a" />
            {/* Legs extending long from hips */}
            <line x1="230" y1="185" x2="305" y2="360" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M298 360 L315 360 L315 366 L295 366 Z" fill="#e2a77a" />
            {/* Tailbone high arrow */}
            <g transform="translate(225, 125)">
              <path d="M0 20 L8 5 M0 8 L10 2 L12 12" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="16" y="10" fill="#06b6d4" fontSize="10" fontWeight="bold">Hips High</text>
            </g>
          </g>
        );

      // ==========================================
      // 7. WARRIOR I (VIRABHADRASANA I)
      // ==========================================
      case 'warrior1-step-1':
      case 'warrior1-step-2':
      case 'warrior1-step-3':
      case 'warrior1-step-4':
        return (
          <g id="warrior1-fig">
            <ellipse cx="220" cy="385" rx="110" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="80" y="375" width="280" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head */}
            <circle cx="195" cy="115" r="21" fill="#f6c29b" />
            <path d="M178 115 C178 98 212 98 212 115 Z" fill="#1e293b" />
            {/* Torso upright and squared forward */}
            <path d="M180 138 L212 138 L208 230 L176 230 Z" fill="#0d9488" rx="6" />
            {/* Arms reaching high overhead */}
            <path d="M182 142 L172 75 L180 35" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M210 142 L220 75 L212 35" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="196" cy="33" r="7" fill="#e2a77a" />
            {/* Front Leg bent at 90 deg */}
            <path d="M180 230 L140 280 L140 375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M130 375 L152 375 L152 382 L130 382 Z" fill="#e2a77a" />
            {/* Back Leg extended straight */}
            <line x1="205" y1="230" x2="295" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M285 375 L305 375 L305 382 L285 382 Z" fill="#e2a77a" />
            {/* Knee alignment indicator */}
            <line x1="140" y1="270" x2="140" y2="375" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />
          </g>
        );

      // ==========================================
      // 8. WARRIOR II (VIRABHADRASANA II)
      // ==========================================
      case 'warrior2-step-1':
      case 'warrior2-step-2':
      case 'warrior2-step-3':
      case 'warrior2-step-4':
        return (
          <g id="warrior2-fig">
            <ellipse cx="220" cy="385" rx="120" ry="12" fill="#cbd5e1" opacity="0.6" />
            <rect x="80" y="375" width="280" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head facing front over right arm */}
            <circle cx="210" cy="120" r="21" fill="#f6c29b" />
            <path d="M193 120 C193 103 227 103 227 120 Z" fill="#1e293b" />
            {/* Torso centered upright */}
            <path d="M195 142 L225 142 L222 235 L192 235 Z" fill="#0d9488" rx="6" />
            {/* Arms extending wide parallel to floor */}
            <line x1="195" y1="150" x2="95" y2="150" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="225" y1="150" x2="325" y2="150" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            {/* Front Leg bent at 90 deg */}
            <path d="M195 235 L145 285 L145 375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M135 375 L158 375 L158 382 L135 382 Z" fill="#e2a77a" />
            {/* Back Leg grounded straight */}
            <line x1="220" y1="235" x2="305" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M295 375 L318 375 L318 382 L295 382 Z" fill="#e2a77a" />
            {/* Horizontal gaze arrow */}
            <g transform="translate(75, 140)">
              <path d="M20 10 L0 10 M8 5 L0 10 L8 15" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="-15" y="-5" fill="#0d9488" fontSize="10" fontWeight="bold">Drishti Gaze</text>
            </g>
          </g>
        );

      // ==========================================
      // 9. SEATED FORWARD FOLD (PASCHIMOTTANASANA)
      // ==========================================
      case 'forwardfold-step-1':
      case 'forwardfold-step-2':
      case 'forwardfold-step-3':
      case 'forwardfold-step-4':
        return (
          <g id="forwardfold-fig">
            <ellipse cx="220" cy="365" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="355" width="300" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Legs flat on floor */}
            <line x1="160" y1="345" x2="315" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M315 335 L315 350 L320 350 L320 335 Z" fill="#e2a77a" />
            {/* Torso folding forward from hips */}
            <path d="M165 330 C165 295 190 270 230 280 C270 290 280 325 240 335 Z" fill="#0d9488" />
            {/* Head relaxing toward shins */}
            <circle cx="255" cy="275" r="19" fill="#f6c29b" />
            {/* Arms reaching to grasp feet */}
            <path d="M195 285 L260 305 L310 335" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <ellipse cx="312" cy="336" rx="6" ry="6" fill="#e2a77a" />
            {/* Fold arrow */}
            <g transform="translate(205, 240)">
              <path d="M15 0 C25 15 35 15 45 25 M38 24 L46 27 L46 19" stroke="#06b6d4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <text x="0" y="-5" fill="#06b6d4" fontSize="10" fontWeight="bold">Hinge from Hips</text>
            </g>
          </g>
        );

      // ==========================================
      // 10. BUTTERFLY POSE (BADDHA KONASANA)
      // ==========================================
      case 'butterfly-step-1':
      case 'butterfly-step-2':
      case 'butterfly-step-3':
      case 'butterfly-step-4':
        return (
          <g id="butterfly-fig">
            <ellipse cx="220" cy="365" rx="110" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="80" y="355" width="280" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Upright Torso */}
            <path d="M205 160 L235 160 L238 275 L202 275 Z" fill="#0d9488" rx="6" />
            {/* Head */}
            <circle cx="220" cy="135" r="21" fill="#f6c29b" />
            <path d="M203 135 C203 118 237 118 237 135 Z" fill="#1e293b" />
            {/* Diamond Legs (Knees open to sides, feet together at center) */}
            <path d="M205 275 L150 325 L215 348" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 275 L290 325 L225 348" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Feet touching */}
            <ellipse cx="220" cy="348" rx="10" ry="8" fill="#e2a77a" />
            {/* Arms holding feet */}
            <path d="M205 170 L195 245 L215 340" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 170 L245 245 L225 340" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            {/* Spine straight indicator */}
            <line x1="220" y1="135" x2="220" y2="340" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
          </g>
        );

      // ==========================================
      // 11. EASY POSE (SUKHASANA)
      // ==========================================
      case 'easy-step-1':
      case 'easy-step-2':
      case 'easy-step-3':
      case 'easy-step-4':
        return (
          <g id="easy-pose-fig">
            <ellipse cx="220" cy="365" rx="110" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="80" y="355" width="280" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Upright aligned spine */}
            <path d="M204 150 L236 150 L238 265 L202 265 Z" fill="#0d9488" rx="6" />
            {/* Head */}
            <circle cx="220" cy="125" r="21" fill="#f6c29b" />
            <path d="M203 125 C203 108 237 108 237 125 Z" fill="#1e293b" />
            {/* Cross-legged base */}
            <path d="M202 265 C170 290 140 330 190 350 C240 350 250 350 290 340" stroke="#334155" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M190 350 L250 348" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            {/* Arms on knees with Jnana Mudra */}
            <path d="M204 160 L170 225 L160 305" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M236 160 L270 225 L280 305" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <circle cx="160" cy="308" r="6" fill="#e2a77a" />
            <circle cx="280" cy="308" r="6" fill="#e2a77a" />
            {/* Serene aura sparkle */}
            <circle cx="220" cy="195" r="15" fill="#0d9488" opacity="0.2" />
          </g>
        );

      // ==========================================
      // 12. CORPSE POSE (SAVASANA)
      // ==========================================
      case 'savasana-step-1':
      case 'savasana-step-2':
      case 'savasana-step-3':
      case 'savasana-step-4':
      default:
        return (
          <g id="savasana-fig">
            <ellipse cx="220" cy="365" rx="145" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="60" y="355" width="320" height="18" rx="9" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head resting on pillow / mat */}
            <circle cx="110" cy="335" r="20" fill="#f6c29b" />
            <path d="M95 335 C95 320 125 320 125 335 Z" fill="#1e293b" />
            {/* Entire Body resting completely flat */}
            <rect x="125" y="325" width="95" height="25" rx="10" fill="#0d9488" />
            <rect x="210" y="327" width="50" height="22" rx="8" fill="#334155" />
            {/* Legs extending long and relaxed */}
            <line x1="250" y1="338" x2="340" y2="345" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <ellipse cx="345" cy="345" rx="6" ry="10" fill="#e2a77a" />
            {/* Arms resting at sides, palms facing up */}
            <line x1="140" y1="340" x2="230" y2="348" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" />
            <ellipse cx="235" cy="348" rx="6" ry="4" fill="#e2a77a" />
            {/* Wave of calm */}
            <path d="M90 310 Q160 300 230 310 T370 310" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.6" />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center w-full select-none ${className}`}>
      {/* Dynamic Background Breathing Aura behind the Yoga Dummy */}
      {showBreathingRing && (
        <div
          className="absolute rounded-full transition-all duration-700 ease-out pointer-events-none -z-10"
          style={{
            width: `${200 * auraScale}px`,
            height: `${200 * auraScale}px`,
            background: `radial-gradient(circle, ${getAuraColor()} 0%, rgba(255, 255, 255, 0) 70%)`,
            filter: 'blur(18px)',
          }}
        />
      )}

      {/* Primary SVG Canvas */}
      <div className="relative w-full max-w-[360px] h-[280px] sm:h-[310px] flex items-center justify-center">
        <svg
          viewBox="0 0 440 420"
          className="w-full h-full drop-shadow-xs overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {renderYogaDummy()}
        </svg>
      </div>

      {/* Posture & Alignment Cues Pill */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2 px-3 text-center">
        {postureCue ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
            <Sparkles className="h-3 w-3 text-teal-600" />
            {postureCue}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
            <Sparkles className="h-3 w-3 text-teal-600" />
            Keep your spine straight & relax shoulders
          </span>
        )}

        {keyAlignment && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
            <CheckCircle2 className="h-3 w-3 text-teal-600" />
            {keyAlignment}
          </span>
        )}
      </div>
    </div>
  );
};
