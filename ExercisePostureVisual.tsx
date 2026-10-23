import React from 'react';
import { ArrowDown, ArrowUp, ArrowRight, RotateCw, Sparkles, CheckCircle2, Shield, Info, Pause } from 'lucide-react';
import { MotionDirection } from '../types';

interface ExercisePostureVisualProps {
  exerciseId?: string;
  stepNumber: number;
  imageKey: string;
  title: string;
  instruction: string;
  motionDirection?: MotionDirection;
  motionArrowLabel?: string;
  bodyHighlight?: string;
  keyAlignment?: string;
  postureCue?: string;
  breathPhase?: 'Inhale' | 'Hold' | 'Exhale' | null;
  breathProgress?: number;
  showBreathingRing?: boolean;
  className?: string;
}

export const ExercisePostureVisual: React.FC<ExercisePostureVisualProps> = ({
  exerciseId,
  stepNumber,
  imageKey,
  title,
  instruction,
  motionDirection = 'hold',
  motionArrowLabel,
  bodyHighlight,
  keyAlignment,
  postureCue,
  breathPhase,
  breathProgress = 0,
  showBreathingRing = true,
  className = '',
}) => {
  // Breathing Aura expansion scale
  let auraScale = 1.0;
  if (breathPhase === 'Inhale') {
    auraScale = 1.0 + breathProgress * 0.16;
  } else if (breathPhase === 'Hold') {
    auraScale = 1.16;
  } else if (breathPhase === 'Exhale') {
    auraScale = 1.16 - breathProgress * 0.16;
  }

  // Aura colors based on breathing phase
  const getAuraColor = () => {
    switch (breathPhase) {
      case 'Inhale':
        return 'rgba(20, 184, 166, 0.20)'; // Teal
      case 'Hold':
        return 'rgba(56, 189, 248, 0.22)'; // Sky Blue
      case 'Exhale':
        return 'rgba(99, 102, 241, 0.20)'; // Indigo
      default:
        return 'rgba(16, 185, 129, 0.15)'; // Emerald
    }
  };

  // Renders the tailored SVG vector illustration for the specific posture
  const renderPostureFigure = () => {
    switch (imageKey) {
      // SQUATS (ex-squats)
      case 'squat-step-1':
        // Upright starting stance
        return (
          <g id="squat-figure-step-1">
            {/* Ground shadow */}
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Head */}
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            {/* Hair */}
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            {/* Torso / athletic top */}
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M214 132 L226 132 L224 215 L216 215 Z" fill="#0f766e" opacity="0.4" />
            {/* Arms at chest (poised) */}
            <path d="M205 140 L190 170 L212 185" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 140 L250 170 L228 185" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Clasped hands */}
            <circle cx="220" cy="185" r="9" fill="#e2a77a" />
            {/* Shorts / hips */}
            <path d="M200 215 L240 215 L244 265 L224 265 L220 235 L216 265 L196 265 Z" fill="#334155" />
            {/* Left Leg (Upright) */}
            <line x1="208" y1="265" x2="204" y2="330" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="204" y1="330" x2="202" y2="375" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            {/* Right Leg (Upright) */}
            <line x1="232" y1="265" x2="236" y2="330" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="236" y1="330" x2="238" y2="375" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            {/* Shoes */}
            <path d="M188 375 L210 375 L210 385 L182 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" rx="2" />
            <path d="M230 375 L252 375 L258 385 L230 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" rx="2" />
            {/* Spinal alignment indicator */}
            <line x1="220" y1="125" x2="220" y2="230" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 3" />
          </g>
        );

      case 'squat-step-2':
        // Hinging & Lowering down
        return (
          <g id="squat-figure-step-2">
            <ellipse cx="205" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Head - tilted forward */}
            <circle cx="240" cy="145" r="22" fill="#f6c29b" />
            <path d="M222 145 C222 127 258 127 258 145 C258 135 250 129 240 129 C230 129 222 135 222 145 Z" fill="#1e293b" />
            {/* Torso hinged at 30 deg */}
            <path d="M225 165 L255 165 L225 245 L195 240 Z" fill="#0d9488" rx="8" />
            {/* Arms reaching forward for counter balance */}
            <path d="M245 170 L285 180 L310 185" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Shorts & hips pushed back */}
            <path d="M190 235 L225 245 L200 285 L180 275 Z" fill="#334155" />
            {/* Thigh bending at 45 deg */}
            <line x1="195" y1="260" x2="225" y2="315" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            {/* Calf */}
            <line x1="225" y1="315" x2="215" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            {/* Shoes */}
            <path d="M200 375 L225 375 L225 385 L195 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Subtle Downward Motion Arrow */}
            <g transform="translate(145, 205)">
              <path d="M10 0 L10 50 M0 40 L10 52 L20 40" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="-5" y="70" fill="#0d9488" fontSize="11" fontWeight="bold">Hips Down</text>
            </g>
          </g>
        );

      case 'squat-step-3':
        // Bottom Parallel Position
        return (
          <g id="squat-figure-step-3">
            <ellipse cx="210" cy="385" rx="95" ry="14" fill="#cbd5e1" opacity="0.6" />
            {/* Head - forward eye gaze */}
            <circle cx="250" cy="180" r="22" fill="#f6c29b" />
            <path d="M232 180 C232 162 268 162 268 180 C268 170 260 164 250 164 C240 164 232 170 232 180 Z" fill="#1e293b" />
            {/* Torso hinged at 45 deg */}
            <path d="M235 200 L265 200 L210 275 L180 270 Z" fill="#0d9488" rx="8" />
            {/* Arms straight forward */}
            <path d="M250 205 L315 205 L335 205" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Shorts */}
            <path d="M175 265 L215 275 L185 305 L160 295 Z" fill="#334155" />
            {/* Thigh horizontal / parallel to floor */}
            <line x1="175" y1="285" x2="250" y2="288" stroke="#f6c29b" strokeWidth="18" strokeLinecap="round" />
            {/* Calf at 80 deg */}
            <line x1="250" y1="288" x2="230" y2="375" stroke="#e2a77a" strokeWidth="16" strokeLinecap="round" />
            {/* Foot / Shoe grounded firmly */}
            <path d="M215 375 L245 375 L245 385 L210 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3.5" />
            {/* Parallel guideline */}
            <line x1="150" y1="288" x2="280" y2="288" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="250" cy="288" r="8" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2.5" />
            <text x="265" y="292" fill="#047857" fontSize="10" fontWeight="bold">90° Knee</text>
          </g>
        );

      case 'squat-step-4':
        // Rising / Driving upward
        return (
          <g id="squat-figure-step-4">
            <ellipse cx="215" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="230" cy="130" r="22" fill="#f6c29b" />
            <path d="M212 130 C212 112 248 112 248 130 C248 120 240 114 230 114 C220 114 212 120 212 130 Z" fill="#1e293b" />
            <path d="M218 150 L248 150 L232 230 L202 230 Z" fill="#0d9488" rx="8" />
            <path d="M235 155 L260 175 L245 195" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M200 230 L240 230 L230 270 L195 270 Z" fill="#334155" />
            <line x1="205" y1="270" x2="220" y2="325" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="220" y1="325" x2="215" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M200 375 L225 375 L225 385 L195 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Upward motion arrow */}
            <g transform="translate(265, 180)">
              <path d="M10 50 L10 0 M0 12 L10 0 L20 12" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <text x="18" y="30" fill="#0d9488" fontSize="11" fontWeight="bold">Drive Up</text>
            </g>
          </g>
        );

      case 'squat-step-5':
        // Finish & Lockout
        return (
          <g id="squat-figure-step-5">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Arms relaxed at sides */}
            <line x1="205" y1="140" x2="190" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="140" x2="250" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="235" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Success badge */}
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </g>
        );

      // PUSHUPS (ex-pushups)
      case 'pushup-step-1':
        // High Plank setup
        return (
          <g id="pushup-figure-step-1">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            {/* Head */}
            <circle cx="110" cy="220" r="18" fill="#f6c29b" />
            <path d="M96 220 C96 205 124 205 124 220 C124 212 118 208 110 208 C102 208 96 212 96 220 Z" fill="#1e293b" />
            {/* Torso in straight line */}
            <line x1="125" y1="230" x2="235" y2="250" stroke="#0d9488" strokeWidth="26" strokeLinecap="round" />
            {/* Arms vertical supporting weight */}
            <line x1="140" y1="230" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <path d="M130 345 L150 345 L150 352 L128 352 Z" fill="#e2a77a" />
            {/* Hips & Legs */}
            <line x1="235" y1="250" x2="335" y2="310" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="310" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            {/* Toes on ground */}
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Alignment line */}
            <line x1="110" y1="210" x2="380" y2="340" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 4" />
          </g>
        );

      case 'pushup-step-2':
        // Lowering phase
        return (
          <g id="pushup-figure-step-2">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="270" r="18" fill="#f6c29b" />
            {/* Torso descending */}
            <line x1="125" y1="275" x2="235" y2="285" stroke="#0d9488" strokeWidth="26" strokeLinecap="round" />
            {/* Elbow bending at 45 deg */}
            <path d="M140 270 L170 295 L145 345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="235" y1="285" x2="335" y2="320" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="320" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Downward arrow */}
            <g transform="translate(180, 230)">
              <path d="M0 0 L0 30 M-6 24 L0 32 L6 24" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="8" y="20" fill="#0d9488" fontSize="10" fontWeight="bold">Lower Down</text>
            </g>
          </g>
        );

      case 'pushup-step-3':
        // Bottom Chest Position
        return (
          <g id="pushup-figure-step-3">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="310" r="18" fill="#f6c29b" />
            {/* Torso nearly hovering over floor */}
            <line x1="125" y1="315" x2="245" y2="318" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Elbow deep 90 deg */}
            <path d="M140 315 L180 305 L145 345" stroke="#f6c29b" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="245" y1="318" x2="345" y2="330" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <line x1="345" y1="330" x2="380" y2="348" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M375 345 L390 345 L392 355 L372 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Chest clearance indicator */}
            <line x1="130" y1="335" x2="190" y2="335" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
            <text x="135" y="300" fill="#f59e0b" fontSize="10" fontWeight="bold">Hover 2" Off Floor</text>
          </g>
        );

      case 'pushup-step-4':
        // Pressing upward
        return (
          <g id="pushup-figure-step-4">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="250" r="18" fill="#f6c29b" />
            <line x1="125" y1="255" x2="235" y2="265" stroke="#0d9488" strokeWidth="26" strokeLinecap="round" />
            {/* Arms extending upward */}
            <path d="M140 255 L155 295 L140 345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="235" y1="265" x2="335" y2="315" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="315" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Upward arrow */}
            <g transform="translate(180, 230)">
              <path d="M0 30 L0 0 M-6 8 L0 0 L6 8" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <text x="8" y="20" fill="#0d9488" fontSize="10" fontWeight="bold">Press Floor</text>
            </g>
          </g>
        );

      case 'pushup-step-5':
        // Full extension reset
        return (
          <g id="pushup-figure-step-5">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="220" r="18" fill="#f6c29b" />
            <line x1="125" y1="230" x2="235" y2="250" stroke="#0d9488" strokeWidth="26" strokeLinecap="round" />
            <line x1="140" y1="230" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="250" x2="335" y2="310" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="310" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(130, 190)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      // PLANK (ex-plank)
      case 'plank-step-1':
        // Kneeling Elbow Setup
        return (
          <g id="plank-figure-step-1">
            <ellipse cx="220" cy="355" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="130" cy="240" r="18" fill="#f6c29b" />
            {/* Torso angled down to forearms */}
            <line x1="145" y1="250" x2="230" y2="280" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Forearm flat on ground */}
            <path d="M150 255 L160 335 L120 335" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Kneeling hips and legs */}
            <line x1="230" y1="280" x2="250" y2="335" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="250" y1="335" x2="290" y2="340" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <circle cx="160" cy="335" r="7" fill="#06b6d4" />
            <text x="95" y="325" fill="#0284c7" fontSize="10" fontWeight="bold">Elbows Under Shoulders</text>
          </g>
        );

      case 'plank-step-2':
        // Stepping feet back
        return (
          <g id="plank-figure-step-2">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="120" cy="250" r="18" fill="#f6c29b" />
            <line x1="135" y1="260" x2="230" y2="275" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <path d="M140 265 L155 340 L120 340" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="230" y1="275" x2="310" y2="305" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="310" y1="305" x2="360" y2="340" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M355 340 L370 340 L372 350 L352 350 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Step back arrow */}
            <g transform="translate(300, 275)">
              <path d="M0 0 L40 20 M30 15 L42 21 L35 30" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="5" y="-5" fill="#0d9488" fontSize="10" fontWeight="bold">Step Back</text>
            </g>
          </g>
        );

      case 'plank-step-3':
        // Full Plank alignment
        return (
          <g id="plank-figure-step-3">
            <ellipse cx="230" cy="355" rx="145" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="270" r="18" fill="#f6c29b" />
            {/* Straight rigid torso */}
            <line x1="130" y1="280" x2="235" y2="285" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <path d="M140 280 L150 345 L115 345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="235" y1="285" x2="330" y2="300" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="330" y1="300" x2="375" y2="342" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 342 L385 342 L388 352 L368 352 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Alignment straight line */}
            <line x1="110" y1="265" x2="375" y2="335" stroke="#10b981" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="235" cy="285" r="9" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
            <text x="220" y="260" fill="#047857" fontSize="10" fontWeight="bold">Neutral Spine</text>
          </g>
        );

      case 'plank-step-4':
        // Isometric breathing hold
        return (
          <g id="plank-figure-step-4">
            <ellipse cx="230" cy="355" rx="145" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="270" r="18" fill="#f6c29b" />
            <line x1="130" y1="280" x2="235" y2="285" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <path d="M140 280 L150 345 L115 345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="235" y1="285" x2="330" y2="300" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="330" y1="300" x2="375" y2="342" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 342 L385 342 L388 352 L368 352 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Core brace glowing aura */}
            <circle cx="215" cy="285" r="28" fill="#06b6d4" fillOpacity="0.15" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />
            <text x="180" y="245" fill="#0284c7" fontSize="11" fontWeight="bold">Brace & Breathe</text>
          </g>
        );

      case 'plank-step-5':
        // Controlled knee release
        return (
          <g id="plank-figure-step-5">
            <ellipse cx="220" cy="355" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="130" cy="260" r="18" fill="#f6c29b" />
            <line x1="145" y1="270" x2="230" y2="295" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <path d="M150 275 L160 345 L120 345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="230" y1="295" x2="245" y2="345" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="245" y1="345" x2="290" y2="348" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <g transform="translate(230, 245)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      // STRETCH (ex-stretch)
      case 'stretch-step-1':
        // Shoulder rolls & neck mobility
        return (
          <g id="stretch-figure-step-1">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Head tilted slightly */}
            <circle cx="225" cy="115" r="22" fill="#f6c29b" />
            <path d="M208 115 C208 97 244 97 244 115 C244 105 236 99 226 99 C216 99 208 105 208 115 Z" fill="#1e293b" />
            <path d="M205 137 L235 137 L238 220 L202 220 Z" fill="#0d9488" rx="8" />
            {/* Arms relaxed with gentle shoulder rotation */}
            <line x1="205" y1="145" x2="190" y2="225" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="145" x2="250" y2="225" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 220 L240 220 L244 270 L196 270 Z" fill="#334155" />
            <line x1="208" y1="270" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="270" x2="235" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Shoulder rotation arc arrow */}
            <path d="M245 135 C265 140 265 160 248 165" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M248 165 L254 158 M248 165 L254 172" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'stretch-step-2':
        // Standing Forward Fold
        return (
          <g id="stretch-figure-step-2">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Hips high */}
            <circle cx="220" cy="210" r="24" fill="#334155" />
            {/* Legs with soft knees */}
            <line x1="210" y1="220" x2="205" y2="310" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="205" y1="310" x2="205" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M190 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Torso folded down completely */}
            <path d="M210 215 L230 215 L225 295 L200 295 Z" fill="#0d9488" rx="8" />
            {/* Head hanging down */}
            <circle cx="212" cy="330" r="18" fill="#f6c29b" />
            {/* Arms reaching down to ankles */}
            <path d="M205 285 L200 365" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" />
            {/* Decompress spine indicator */}
            <path d="M235 220 Q240 270 230 320" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            <text x="245" y="270" fill="#0284c7" fontSize="10" fontWeight="bold">Spine Release</text>
          </g>
        );

      case 'stretch-step-3':
        // Low Lunge Hip Flexor Stretch
        return (
          <g id="stretch-figure-step-3">
            <ellipse cx="230" cy="385" rx="120" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Torso tall upright */}
            <circle cx="205" cy="165" r="20" fill="#f6c29b" />
            <path d="M192 185 L218 185 L215 260 L188 260 Z" fill="#0d9488" rx="6" />
            {/* Hands on front thigh */}
            <path d="M195 200 L185 245 L200 270" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Front Leg in 90 deg lunge */}
            <line x1="205" y1="260" x2="160" y2="285" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <line x1="160" y1="285" x2="160" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M145 375 L170 375 L170 385 L142 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Rear Leg extended with knee resting on mat */}
            <line x1="210" y1="260" x2="275" y2="330" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
            <line x1="275" y1="330" x2="335" y2="375" stroke="#e2a77a" strokeWidth="13" strokeLinecap="round" />
            {/* Stretch halo on rear hip flexor */}
            <circle cx="235" cy="275" r="14" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2" />
            <text x="250" y="275" fill="#d97706" fontSize="10" fontWeight="bold">Hip Flexor Stretch</text>
          </g>
        );

      case 'stretch-step-4':
        // Seated Butterfly Stretch
        return (
          <g id="stretch-figure-step-4">
            <ellipse cx="220" cy="380" rx="90" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="180" r="20" fill="#f6c29b" />
            {/* Torso sitting tall */}
            <path d="M205 202 L235 202 L230 290 L210 290 Z" fill="#0d9488" rx="8" />
            {/* Hips on floor */}
            <path d="M195 285 L245 285 L235 320 L205 320 Z" fill="#334155" />
            {/* Butterfly knees spread wide */}
            <path d="M205 295 L160 335 L215 365" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 295 L280 335 L225 365" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Soles together in center */}
            <ellipse cx="220" cy="365" rx="14" ry="8" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            {/* Hands holding ankles */}
            <path d="M205 225 L190 285 L210 350" stroke="#f6c29b" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M235 225 L250 285 L230 350" stroke="#f6c29b" strokeWidth="9" strokeLinecap="round" fill="none" />
            <text x="175" y="325" fill="#047857" fontSize="10" fontWeight="bold">Knees Relax Outward</text>
          </g>
        );

      // CARDIO (ex-cardio)
      case 'cardio-step-1':
        // Warm-up March in place
        return (
          <g id="cardio-figure-step-1">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L236 215 L204 215 Z" fill="#0d9488" rx="8" />
            {/* Arm swing: right arm forward, left back */}
            <path d="M205 140 L180 180 L195 210" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M235 140 L260 170 L275 160" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            {/* Standing grounded leg */}
            <line x1="208" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Marching lifted knee at 90 deg */}
            <path d="M232 265 L265 295 L260 350" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M250 350 L275 350 L278 360 L248 360 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Upward motion arrow on knee */}
            <g transform="translate(285, 290)">
              <path d="M0 25 L0 0 M-5 8 L0 0 L5 8" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      case 'cardio-step-2':
        // Low-Impact Step Jack (arms overhead, foot out)
        return (
          <g id="cardio-figure-step-2">
            <ellipse cx="220" cy="385" rx="105" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="210" cy="120" r="22" fill="#f6c29b" />
            <path d="M198 142 L224 142 L225 220 L195 220 Z" fill="#0d9488" rx="8" />
            {/* Both arms sweeping overhead */}
            <path d="M198 145 L160 100 L180 75" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M224 145 L260 100 L240 75" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M192 220 L228 220 L224 265 L190 265 Z" fill="#334155" />
            {/* Left leg center */}
            <line x1="198" y1="265" x2="195" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M185 375 L208 375 L208 385 L182 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Right leg stepped out wide */}
            <line x1="222" y1="265" x2="280" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M272 375 L298 375 L300 385 L270 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Lateral step arrow */}
            <g transform="translate(235, 345)">
              <path d="M0 0 L35 0 M28 -5 L37 0 L28 5" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="5" y="-8" fill="#0d9488" fontSize="10" fontWeight="bold">Step Out</text>
            </g>
          </g>
        );

      case 'cardio-step-3':
        // High-Knee Cross Touch
        return (
          <g id="cardio-figure-step-3">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="215" cy="115" r="22" fill="#f6c29b" />
            <path d="M200 137 L230 137 L228 215 L198 215 Z" fill="#0d9488" rx="8" />
            {/* Opposite hand reaching across to knee */}
            <path d="M200 145 L175 195 L225 245" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Knee lifted high toward core */}
            <path d="M225 215 L235 255 L225 250" fill="#334155" />
            <path d="M225 245 L250 240 L245 320" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Standing leg */}
            <line x1="205" y1="215" x2="198" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M185 375 L210 375 L210 385 L182 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <circle cx="230" cy="245" r="8" fill="#10b981" fillOpacity="0.35" stroke="#10b981" strokeWidth="2" />
          </g>
        );

      case 'cardio-step-4':
        // Lateral Skater Step
        return (
          <g id="cardio-figure-step-4">
            <ellipse cx="220" cy="385" rx="100" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="190" cy="150" r="22" fill="#f6c29b" />
            {/* Torso leaning into left crouch */}
            <path d="M178 172 L206 172 L198 245 L172 245 Z" fill="#0d9488" rx="8" />
            {/* Arm reach across */}
            <path d="M180 178 L155 215 L135 230" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M205 178 L235 195 L265 170" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            {/* Left bent knee supporting weight */}
            <path d="M175 245 L165 295 L165 375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M152 375 L175 375 L175 385 L148 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Right leg swept behind diagonally */}
            <path d="M195 245 L245 305 L285 370" stroke="#334155" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M280 370 L298 370 L298 380 L278 380 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Dynamic flow arrow */}
            <g transform="translate(230, 240)">
              <path d="M0 0 L40 25 M30 25 L42 26 L38 15" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      // WALKING (ex-walking)
      case 'walking-step-1':
        // Upright stance alignment
        return (
          <g id="walking-figure-step-1">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="140" x2="195" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="140" x2="245" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="235" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="220" y1="120" x2="220" y2="250" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <text x="235" y="115" fill="#0284c7" fontSize="10" fontWeight="bold">Forward Gaze</text>
          </g>
        );

      case 'walking-step-2':
        // Heel strike transition
        return (
          <g id="walking-figure-step-2">
            <ellipse cx="220" cy="385" rx="100" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="215" cy="115" r="22" fill="#f6c29b" />
            <path d="M202 137 L230 137 L232 215 L200 215 Z" fill="#0d9488" rx="8" />
            {/* Front arm swinging back, rear arm forward */}
            <path d="M202 145 L180 185 L165 210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M230 145 L250 185 L265 210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M196 215 L234 215 L230 265 L192 265 Z" fill="#334155" />
            {/* Front leg reaching forward on heel */}
            <line x1="205" y1="265" x2="160" y2="370" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M145 365 L168 375 L162 385 L140 375 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" transform="rotate(-15 150 370)" />
            {/* Rear leg pushing off toe */}
            <line x1="225" y1="265" x2="265" y2="370" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M260 370 L280 370 L282 380 L258 380 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <circle cx="150" cy="375" r="7" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            <text x="110" y="360" fill="#047857" fontSize="10" fontWeight="bold">Soft Heel Strike</text>
          </g>
        );

      case 'walking-step-3':
        // Mid-stance balance roll
        return (
          <g id="walking-figure-step-3">
            <ellipse cx="220" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="112" r="22" fill="#f6c29b" />
            <path d="M205 134 L235 134 L236 215 L204 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="140" x2="195" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="140" x2="245" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M198 215 L238 215 L234 265 L194 265 Z" fill="#334155" />
            {/* Grounded foot supporting weight */}
            <line x1="208" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L218 375 L218 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Opposite foot swinging through smoothly */}
            <path d="M228 265 L245 320 L235 360" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M228 358 L250 358 L252 368 L225 368 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
          </g>
        );

      case 'walking-step-4':
        // Forward cadence flow
        return (
          <g id="walking-figure-step-4">
            <ellipse cx="220" cy="385" rx="100" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="225" cy="115" r="22" fill="#f6c29b" />
            <path d="M210 137 L238 137 L236 215 L208 215 Z" fill="#0d9488" rx="8" />
            <path d="M210 145 L240 185 L255 210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M238 145 L215 185 L200 210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M204 215 L242 215 L238 265 L200 265 Z" fill="#334155" />
            <line x1="210" y1="265" x2="255" y2="370" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M245 370 L270 370 L272 380 L242 380 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="230" y1="265" x2="185" y2="370" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M175 370 L198 370 L198 380 L172 380 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(255, 150)">
              <path d="M0 0 L35 0 M25 -5 L35 0 L25 5" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="5" y="-8" fill="#0d9488" fontSize="10" fontWeight="bold">Steady Pace</text>
            </g>
          </g>
        );

      // GLUTE BRIDGE (ex-glute-bridge)
      case 'bridge-step-1':
        // Supine starting position
        return (
          <g id="bridge-figure-step-1">
            <ellipse cx="220" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            {/* Head on floor */}
            <circle cx="110" cy="335" r="18" fill="#f6c29b" />
            {/* Back flat on mat */}
            <line x1="125" y1="340" x2="225" y2="340" stroke="#0d9488" strokeWidth="22" strokeLinecap="round" />
            <path d="M210 330 L250 330 L250 348 L210 348 Z" fill="#334155" />
            {/* Knees bent at 90 deg, feet on floor */}
            <line x1="245" y1="335" x2="280" y2="285" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <line x1="280" y1="285" x2="310" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M300 345 L325 345 L325 355 L298 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Arms flat on ground */}
            <line x1="140" y1="345" x2="210" y2="345" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" />
            <text x="130" y="315" fill="#0284c7" fontSize="10" fontWeight="bold">Back Flat On Mat</text>
          </g>
        );

      case 'bridge-step-2':
        // Pelvic tilt & engagement
        return (
          <g id="bridge-figure-step-2">
            <ellipse cx="220" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="335" r="18" fill="#f6c29b" />
            <line x1="125" y1="340" x2="225" y2="338" stroke="#0d9488" strokeWidth="22" strokeLinecap="round" />
            <circle cx="230" cy="335" r="16" fill="#06b6d4" fillOpacity="0.3" stroke="#06b6d4" strokeWidth="2" />
            <line x1="245" y1="335" x2="280" y2="285" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <line x1="280" y1="285" x2="310" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M300 345 L325 345 L325 355 L298 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="210" y="300" fill="#0284c7" fontSize="10" fontWeight="bold">Tuck Pelvis</text>
          </g>
        );

      case 'bridge-step-3':
        // Top Bridge elevation
        return (
          <g id="bridge-figure-step-3">
            <ellipse cx="220" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="335" r="18" fill="#f6c29b" />
            {/* Torso forming diagonal ramp */}
            <line x1="125" y1="335" x2="225" y2="270" stroke="#0d9488" strokeWidth="22" strokeLinecap="round" />
            {/* Hips elevated, straight diagonal line */}
            <line x1="225" y1="270" x2="280" y2="270" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="280" y1="270" x2="310" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M300 345 L325 345 L325 355 L298 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Diagonal guideline */}
            <line x1="110" y1="335" x2="280" y2="270" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
            {/* Squeeze glutes upward arrow */}
            <g transform="translate(235, 220)">
              <path d="M0 30 L0 0 M-6 8 L0 0 L6 8" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="10" y="18" fill="#0d9488" fontSize="10" fontWeight="bold">Squeeze Glutes</text>
            </g>
          </g>
        );

      case 'bridge-step-4':
        // Controlled descent
        return (
          <g id="bridge-figure-step-4">
            <ellipse cx="220" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="110" cy="335" r="18" fill="#f6c29b" />
            <line x1="125" y1="338" x2="225" y2="305" stroke="#0d9488" strokeWidth="22" strokeLinecap="round" />
            <line x1="225" y1="305" x2="280" y2="285" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <line x1="280" y1="285" x2="310" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M300 345 L325 345 L325 355 L298 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(235, 230)">
              <path d="M0 0 L0 25 M-6 18 L0 26 L6 18" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="10" y="18" fill="#0d9488" fontSize="10" fontWeight="bold">Lower Slowly</text>
            </g>
          </g>
        );

      // BIRD-DOG (ex-bird-dog)
      case 'bird-dog-step-1':
        // Tabletop setup
        return (
          <g id="bird-dog-step-1">
            <ellipse cx="220" cy="355" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="130" cy="225" r="18" fill="#f6c29b" />
            {/* Flat back */}
            <line x1="140" y1="240" x2="250" y2="240" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Hands under shoulders */}
            <line x1="150" y1="240" x2="150" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Knees under hips */}
            <line x1="240" y1="240" x2="240" y2="345" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <path d="M240 345 L275 345" stroke="#e2a77a" strokeWidth="12" strokeLinecap="round" />
            <line x1="120" y1="230" x2="270" y2="230" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <text x="160" y="215" fill="#0284c7" fontSize="10" fontWeight="bold">Flat Tabletop Spine</text>
          </g>
        );

      case 'bird-dog-step-2':
        // Core brace & extension
        return (
          <g id="bird-dog-step-2">
            <ellipse cx="220" cy="355" rx="145" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="150" cy="225" r="18" fill="#f6c29b" />
            <line x1="160" y1="240" x2="250" y2="240" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Supporting left hand */}
            <line x1="170" y1="240" x2="170" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Right arm reaching forward */}
            <line x1="170" y1="240" x2="70" y2="240" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Supporting knee */}
            <line x1="240" y1="240" x2="240" y2="345" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            {/* Left leg extending back */}
            <line x1="250" y1="240" x2="350" y2="240" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <path d="M350 240 L375 240" stroke="#e2a77a" strokeWidth="12" strokeLinecap="round" />
          </g>
        );

      case 'bird-dog-step-3':
        // Peak Parallel Hold
        return (
          <g id="bird-dog-step-3">
            <ellipse cx="220" cy="355" rx="150" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="160" cy="225" r="18" fill="#f6c29b" />
            <line x1="170" y1="240" x2="250" y2="240" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="180" y1="240" x2="180" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Hand reached long */}
            <line x1="180" y1="240" x2="60" y2="240" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="240" y1="240" x2="240" y2="345" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            {/* Leg kicked back completely parallel */}
            <line x1="250" y1="240" x2="365" y2="240" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            {/* Straight parallel line */}
            <line x1="55" y1="230" x2="375" y2="230" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="210" cy="240" r="14" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
            <text x="180" y="210" fill="#047857" fontSize="10" fontWeight="bold">Parallel to Mat</text>
          </g>
        );

      case 'bird-dog-step-4':
        // Return & Reset
        return (
          <g id="bird-dog-step-4">
            <ellipse cx="220" cy="355" rx="130" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="130" cy="225" r="18" fill="#f6c29b" />
            <line x1="140" y1="240" x2="250" y2="240" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="150" y1="240" x2="150" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="240" y1="240" x2="240" y2="345" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
            <g transform="translate(190, 260)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="140" y="215" fill="#047857" fontSize="10" fontWeight="bold">Switch Sides Controlled</text>
          </g>
        );

      // YOGA (ex-gentle-yoga)
      case 'yoga-step-1':
        // Mountain Pose (Tadasana)
        return (
          <g id="yoga-step-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Open palms facing forward */}
            <path d="M205 140 L188 220" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M235 140 L252 220" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L242 265 L198 265 Z" fill="#334155" />
            <line x1="210" y1="265" x2="208" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="265" x2="232" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M194 375 L216 375 L216 385 L190 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M224 375 L246 375 L248 385 L222 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            {/* Crown reach aura */}
            <line x1="220" y1="85" x2="220" y2="60" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
            <text x="180" y="50" fill="#047857" fontSize="10" fontWeight="bold">Crown Reaches High</text>
          </g>
        );

      case 'yoga-step-2':
        // Upward Salute (Urdhva Hastasana)
        return (
          <g id="yoga-step-2">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="115" r="22" fill="#f6c29b" />
            <path d="M202 115 C202 97 238 97 238 115 C238 105 230 99 220 99 C210 99 202 105 202 115 Z" fill="#1e293b" />
            <path d="M205 137 L235 137 L238 220 L202 220 Z" fill="#0d9488" rx="8" />
            {/* Arms reaching upward in salute */}
            <path d="M205 140 L195 90 L212 55" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 140 L245 90 L228 55" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Palms meet overhead */}
            <circle cx="220" cy="50" r="7" fill="#e2a77a" />
            <path d="M200 220 L240 220 L242 270 L198 270 Z" fill="#334155" />
            <line x1="210" y1="270" x2="208" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="270" x2="232" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M194 375 L216 375 L216 385 L190 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M224 375 L246 375 L248 385 L222 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <g transform="translate(245, 60)">
              <path d="M0 25 L0 0 M-5 7 L0 0 L5 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="8" y="15" fill="#047857" fontSize="10" fontWeight="bold">Reach Up</text>
            </g>
          </g>
        );

      case 'yoga-step-3':
        // Forward Fold (Uttanasana)
        return (
          <g id="yoga-step-3">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="210" r="24" fill="#334155" />
            <line x1="210" y1="220" x2="205" y2="310" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="205" y1="310" x2="205" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M190 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M210 215 L230 215 L225 295 L200 295 Z" fill="#0d9488" rx="8" />
            <circle cx="212" cy="330" r="18" fill="#f6c29b" />
            <path d="M205 285 L200 365" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" />
            <text x="235" y="275" fill="#0284c7" fontSize="10" fontWeight="bold">Soft Knees Fold</text>
          </g>
        );

      case 'yoga-step-4':
        // Halfway Lift (Ardha Uttanasana)
        return (
          <g id="yoga-step-4">
            <ellipse cx="220" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Hips hinged */}
            <circle cx="240" cy="225" r="22" fill="#334155" />
            <line x1="240" y1="235" x2="240" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M225 375 L250 375 L250 385 L220 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Flat spine parallel to floor */}
            <line x1="240" y1="225" x2="140" y2="225" stroke="#0d9488" strokeWidth="22" strokeLinecap="round" />
            {/* Head gazing down to mat */}
            <circle cx="120" cy="225" r="18" fill="#f6c29b" />
            {/* Hands resting lightly on shins */}
            <path d="M160 230 L180 280 L230 300" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="120" y1="210" x2="250" y2="210" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
            <text x="145" y="200" fill="#047857" fontSize="10" fontWeight="bold">Flat Neutral Spine</text>
          </g>
        );

      // RELAXATION (ex-relaxation-unwind)
      case 'relax-step-1':
        // Seated Grounding & Shoulder Release
        return (
          <g id="relax-step-1">
            <ellipse cx="220" cy="380" rx="90" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="165" r="22" fill="#f6c29b" />
            <path d="M205 187 L235 187 L230 275 L210 275 Z" fill="#0d9488" rx="8" />
            <path d="M195 270 L245 270 L235 315 L205 315 Z" fill="#334155" />
            {/* Crossed legs / relaxed sitting */}
            <path d="M205 285 L160 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 285 L280 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Palms resting gently on knees */}
            <path d="M205 205 L175 270 L185 320" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M235 205 L265 270 L255 320" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <circle cx="220" cy="165" r="32" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="175" y="115" fill="#0284c7" fontSize="10" fontWeight="bold">Release Shoulder Tension</text>
          </g>
        );

      case 'relax-step-2':
        // Diaphragmatic Breath Expansion
        return (
          <g id="relax-step-2">
            <ellipse cx="220" cy="380" rx="90" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="165" r="22" fill="#f6c29b" />
            <path d="M205 187 L235 187 L230 275 L210 275 Z" fill="#0d9488" rx="8" />
            <path d="M195 270 L245 270 L235 315 L205 315 Z" fill="#334155" />
            <path d="M205 285 L160 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 285 L280 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hands placed gently over abdomen */}
            <path d="M205 205 L190 235 L215 245" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 205 L250 235 L225 245" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="220" cy="245" r="22" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
            <text x="175" y="115" fill="#047857" fontSize="10" fontWeight="bold">Breathe Deep Into Belly</text>
          </g>
        );

      case 'relax-step-3':
        // Lateral Neck & Shoulder Release
        return (
          <g id="relax-step-3">
            <ellipse cx="220" cy="380" rx="90" ry="14" fill="#cbd5e1" opacity="0.6" />
            {/* Head tilted softly to right shoulder */}
            <circle cx="232" cy="170" r="22" fill="#f6c29b" />
            <path d="M205 187 L235 187 L230 275 L210 275 Z" fill="#0d9488" rx="8" />
            <path d="M195 270 L245 270 L235 315 L205 315 Z" fill="#334155" />
            <path d="M205 285 L160 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 285 L280 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Opposite hand walking away slightly for gentle stretch */}
            <path d="M205 205 L170 270 L150 310" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M235 205 L260 270 L250 320" stroke="#f6c29b" strokeWidth="10" strokeLinecap="round" fill="none" />
            <path d="M195 180 C185 190 185 205 195 215" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            <text x="160" y="115" fill="#6d28d9" fontSize="10" fontWeight="bold">Gentle Trapezius Release</text>
          </g>
        );

      case 'relax-step-4':
        // Heart Center Stillness & Calm
        return (
          <g id="relax-step-4">
            <ellipse cx="220" cy="380" rx="90" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="165" r="22" fill="#f6c29b" />
            <path d="M205 187 L235 187 L230 275 L210 275 Z" fill="#0d9488" rx="8" />
            <path d="M195 270 L245 270 L235 315 L205 315 Z" fill="#334155" />
            <path d="M205 285 L160 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 285 L280 325 L220 355" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Hands placed in prayer/stillness over heart */}
            <path d="M205 200 L212 215 L220 215" stroke="#f6c29b" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M235 200 L228 215 L220 215" stroke="#f6c29b" strokeWidth="9" strokeLinecap="round" fill="none" />
            <g transform="translate(210, 205)">
              <circle cx="10" cy="10" r="14" fill="#10b981" fillOpacity="0.2" />
              <path d="M6 10 L9 13 L15 7" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="175" y="115" fill="#047857" fontSize="10" fontWeight="bold">Settle into Stillness</text>
          </g>
        );

      // FULL BODY (ex-fullbody)
      case 'fullbody-step-1':
        // Tall Reach & Calf Lift
        return (
          <g id="fullbody-step-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 210 L202 210 Z" fill="#0d9488" rx="8" />
            {/* Arms reaching overhead */}
            <line x1="205" y1="130" x2="195" y2="55" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="130" x2="245" y2="55" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 210 L240 210 L242 260 L198 260 Z" fill="#334155" />
            {/* On balls of feet */}
            <line x1="210" y1="260" x2="208" y2="370" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="230" y1="260" x2="232" y2="370" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M196 370 L214 370 L214 378 L194 378 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M226 370 L244 370 L246 378 L224 378 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <text x="175" y="45" fill="#0284c7" fontSize="10" fontWeight="bold">Full Body Extension</text>
          </g>
        );

      case 'fullbody-step-2':
        // Dynamic Squat & Arm Sweep
        return (
          <g id="fullbody-step-2">
            <ellipse cx="210" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="245" cy="180" r="22" fill="#f6c29b" />
            <path d="M230 200 L260 200 L210 270 L185 265 Z" fill="#0d9488" rx="8" />
            <path d="M245 205 L310 205" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M180 260 L220 270 L190 300 L165 290 Z" fill="#334155" />
            <line x1="180" y1="280" x2="250" y2="285" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="250" y1="285" x2="230" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M215 375 L245 375 L245 385 L210 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="155" y="325" fill="#d97706" fontSize="10" fontWeight="bold">Sink & Sweep Arms</text>
          </g>
        );

      case 'fullbody-step-3':
        // Lateral Torso & Hip Sweep
        return (
          <g id="fullbody-step-3">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="230" cy="120" r="22" fill="#f6c29b" />
            <path d="M210 140 L240 140 L235 220 L205 220 Z" fill="#0d9488" rx="8" />
            {/* Arms sweeping across torso */}
            <path d="M210 145 L255 170 L280 165" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 220 L240 220 L242 270 L198 270 Z" fill="#334155" />
            <line x1="205" y1="270" x2="190" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <line x1="235" y1="270" x2="250" y2="375" stroke="#f6c29b" strokeWidth="15" strokeLinecap="round" />
            <path d="M175 375 L200 375 L200 385 L172 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M240 375 L265 375 L268 385 L238 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <text x="165" y="85" fill="#6d28d9" fontSize="10" fontWeight="bold">Gentle Torso Rotation</text>
          </g>
        );

      case 'fullbody-step-4':
        // Centering Breath & Reset
        return (
          <g id="fullbody-step-4">
            <ellipse cx="220" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="140" x2="190" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="140" x2="250" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="235" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="180" y="80" fill="#047857" fontSize="10" fontWeight="bold">Balanced Centered Stance</text>
          </g>
        );

      // ==========================================
      // LUNGES (ex-lunges)
      // ==========================================
      case 'lunge-step-1':
        // Upright stance, hands on hips
        return (
          <g id="lunge-figure-step-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Hands on hips */}
            <path d="M205 140 L185 175 L204 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M235 140 L255 175 L236 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="220" y1="120" x2="220" y2="240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <text x="175" y="80" fill="#0891b2" fontSize="10" fontWeight="bold">Feet Hip-Width Apart</text>
          </g>
        );

      case 'lunge-step-2':
        // Stepping forward
        return (
          <g id="lunge-figure-step-2">
            <ellipse cx="230" cy="385" rx="105" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="225" cy="120" r="22" fill="#f6c29b" />
            <path d="M207 120 C207 102 243 102 243 120 C243 110 235 104 225 104 C215 104 207 110 207 120 Z" fill="#1e293b" />
            <path d="M210 142 L240 142 L242 225 L208 225 Z" fill="#0d9488" rx="8" />
            <path d="M210 150 L195 185 L210 205" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M240 150 L255 185 L240 205" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M205 225 L245 225 L250 270 L200 270 Z" fill="#334155" />
            {/* Front leg stepping out */}
            <line x1="235" y1="270" x2="280" y2="330" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="280" y1="330" x2="285" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M272 375 L302 375 L305 385 L270 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Back leg extending back */}
            <line x1="210" y1="270" x2="175" y2="330" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="175" y1="330" x2="160" y2="375" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M150 372 L172 372 L174 382 L148 382 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <g transform="translate(290, 310)">
              <path d="M0 0 L25 15 M15 14 L28 17 L22 28" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="-5" y="-6" fill="#0d9488" fontSize="10" fontWeight="bold">Step Forward</text>
            </g>
          </g>
        );

      case 'lunge-step-3':
        // Bottom 90/90 Lunge position
        return (
          <g id="lunge-figure-step-3">
            <ellipse cx="230" cy="385" rx="110" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="150" r="22" fill="#f6c29b" />
            <path d="M202 150 C202 132 238 132 238 150 C238 140 230 134 220 134 C210 134 202 140 202 150 Z" fill="#1e293b" />
            <path d="M205 172 L235 172 L236 250 L204 250 Z" fill="#0d9488" rx="8" />
            <path d="M205 180 L190 215 L205 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 180 L250 215 L235 235" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M202 250 L238 250 L242 290 L198 290 Z" fill="#334155" />
            {/* Front Leg: Thigh horizontal at 90 deg */}
            <line x1="235" y1="285" x2="310" y2="290" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            {/* Front Shin: Vertical */}
            <line x1="310" y1="290" x2="310" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M295 375 L328 375 L330 385 L292 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Back Leg: Thigh vertical downward */}
            <line x1="205" y1="285" x2="195" y2="350" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            {/* Back Shin: Horizontal hovering floor */}
            <line x1="195" y1="350" x2="135" y2="365" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M130 360 L145 375 L135 382 L122 370 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            {/* Alignment indicator */}
            <line x1="220" y1="160" x2="220" y2="280" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="310" cy="290" r="9" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
            <text x="295" y="270" fill="#047857" fontSize="10" fontWeight="bold">90° Knee Angle</text>
          </g>
        );

      case 'lunge-step-4':
        // Driving upward from heel
        return (
          <g id="lunge-figure-step-4">
            <ellipse cx="230" cy="385" rx="100" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="222" cy="130" r="22" fill="#f6c29b" />
            <path d="M204 130 C204 112 240 112 240 130 C240 120 232 114 222 114 C212 114 204 120 204 130 Z" fill="#1e293b" />
            <path d="M208 152 L238 152 L238 230 L204 230 Z" fill="#0d9488" rx="8" />
            <path d="M208 160 L192 195 L208 215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M238 160 L254 195 L238 215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M204 230 L240 230 L244 275 L200 275 Z" fill="#334155" />
            <line x1="236" y1="275" x2="285" y2="330" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="285" y1="330" x2="295" y2="375" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M280 375 L310 375 L312 385 L278 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="210" y1="275" x2="185" y2="335" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="185" y1="335" x2="175" y2="375" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M165 372 L188 372 L190 382 L162 382 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <g transform="translate(250, 170)">
              <path d="M0 40 L0 5 M-6 15 L0 3 L6 15" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <text x="10" y="25" fill="#0d9488" fontSize="10" fontWeight="bold">Drive Through Heel</text>
            </g>
          </g>
        );

      case 'lunge-step-5':
        // Finished & Standing Tall
        return (
          <g id="lunge-figure-step-5">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M202 110 C202 92 238 92 238 110 C238 100 230 94 220 94 C210 94 202 100 202 110 Z" fill="#1e293b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="140" x2="190" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="140" x2="250" y2="215" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="180" y="80" fill="#047857" fontSize="10" fontWeight="bold">Complete & Reset</text>
          </g>
        );

      // ==========================================
      // WALL PUSH-UPS (ex-wall-pushups)
      // ==========================================
      case 'wall-pushup-step-1':
        // Standing incline arm-reach to wall
        return (
          <g id="wall-pushup-fig-1">
            <ellipse cx="240" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            {/* Wall Line on Left */}
            <line x1="80" y1="50" x2="80" y2="400" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="68" y="50" width="12" height="350" fill="#cbd5e1" />
            <circle cx="195" cy="140" r="22" fill="#f6c29b" />
            {/* Torso tilted towards wall */}
            <line x1="205" y1="150" x2="250" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Arms straight to wall */}
            <line x1="200" y1="165" x2="84" y2="165" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="84" cy="165" r="7" fill="#0d9488" />
            {/* Legs extended back */}
            <line x1="250" y1="255" x2="280" y2="375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <path d="M270 375 L300 375 L302 385 L268 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="100" y="145" fill="#0284c7" fontSize="10" fontWeight="bold">Palms Flat at Shoulder Height</text>
          </g>
        );

      case 'wall-pushup-step-2':
        // Bending elbows towards wall
        return (
          <g id="wall-pushup-fig-2">
            <ellipse cx="230" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <line x1="80" y1="50" x2="80" y2="400" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="68" y="50" width="12" height="350" fill="#cbd5e1" />
            <circle cx="155" cy="145" r="22" fill="#f6c29b" />
            <line x1="165" y1="155" x2="230" y2="260" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Bent arms */}
            <path d="M160 170 L140 205 L84 175" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="230" y1="260" x2="275" y2="375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <path d="M265 375 L295 375 L298 385 L262 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(110, 195)">
              <path d="M30 0 L5 0 M15 -6 L3 0 L15 6" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="35" y="4" fill="#0d9488" fontSize="10" fontWeight="bold">Lower Chest</text>
            </g>
          </g>
        );

      case 'wall-pushup-step-3':
        // Chest closest to wall
        return (
          <g id="wall-pushup-fig-3">
            <ellipse cx="210" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <line x1="80" y1="50" x2="80" y2="400" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="68" y="50" width="12" height="350" fill="#cbd5e1" />
            <circle cx="125" cy="150" r="22" fill="#f6c29b" />
            <line x1="135" y1="160" x2="215" y2="265" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Deep arm flex */}
            <path d="M130 175 L120 220 L84 185" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="215" y1="265" x2="270" y2="375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <path d="M260 375 L290 375 L292 385 L258 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="125" y1="140" x2="280" y2="370" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
            <text x="140" y="115" fill="#047857" fontSize="10" fontWeight="bold">Hold 2 Inches from Wall</text>
          </g>
        );

      case 'wall-pushup-step-4':
        // Pressing back to start
        return (
          <g id="wall-pushup-fig-4">
            <ellipse cx="240" cy="385" rx="80" ry="12" fill="#cbd5e1" opacity="0.6" />
            <line x1="80" y1="50" x2="80" y2="400" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <rect x="68" y="50" width="12" height="350" fill="#cbd5e1" />
            <circle cx="195" cy="140" r="22" fill="#f6c29b" />
            <line x1="205" y1="150" x2="250" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="200" y1="165" x2="84" y2="165" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="250" y1="255" x2="280" y2="375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <path d="M270 375 L300 375 L302 385 L268 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(110, 195)">
              <path d="M5 0 L30 0 M20 -6 L32 0 L20 6" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="38" y="4" fill="#0d9488" fontSize="10" fontWeight="bold">Push Away</text>
            </g>
          </g>
        );

      // ==========================================
      // JUMPING JACKS (ex-jumping-jacks)
      // ==========================================
      case 'jumping-jacks-step-1':
        // Starting Position: Feet together, arms down
        return (
          <g id="jack-figure-step-1">
            <ellipse cx="220" cy="385" rx="65" ry="10" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M202 105 C202 87 238 87 238 105 C238 95 230 89 220 89 C210 89 202 95 202 105 Z" fill="#1e293b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="135" x2="192" y2="220" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="135" x2="248" y2="220" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L242 265 L198 265 Z" fill="#334155" />
            <line x1="212" y1="265" x2="212" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="228" y1="265" x2="228" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M202 375 L222 375 L222 385 L200 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M218 375 L238 375 L240 385 L216 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="175" y="75" fill="#0891b2" fontSize="10" fontWeight="bold">Tall Athletic Base</text>
          </g>
        );

      case 'jumping-jacks-step-2':
        // Jumping outward mid-air
        return (
          <g id="jack-figure-step-2">
            <ellipse cx="220" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.4" />
            <circle cx="220" cy="95" r="22" fill="#f6c29b" />
            <path d="M202 95 C202 77 238 77 238 95 C238 85 230 79 220 79 C210 79 202 85 202 95 Z" fill="#1e293b" />
            <path d="M205 117 L235 117 L238 205 L202 205 Z" fill="#0d9488" rx="8" />
            {/* Arms lifting outward to T-shape */}
            <line x1="205" y1="125" x2="140" y2="120" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="125" x2="300" y2="120" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M198 205 L242 205 L248 255 L192 255 Z" fill="#334155" />
            {/* Legs spreading in air */}
            <line x1="205" y1="255" x2="170" y2="355" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="235" y1="255" x2="270" y2="355" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M155 355 L178 355 L176 365 L152 365 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <path d="M262 355 L285 355 L288 365 L260 365 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            {/* Outward arc arrows */}
            <path d="M125 150 C115 130 125 110 135 105" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
            <path d="M315 150 C325 130 315 110 305 105" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
            <text x="175" y="65" fill="#0d9488" fontSize="10" fontWeight="bold">Spring & Swing Up</text>
          </g>
        );

      case 'jumping-jacks-step-3':
        // Peak Star Stance: Hands meet overhead, feet wide
        return (
          <g id="jack-figure-step-3">
            <ellipse cx="220" cy="385" rx="120" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="115" r="22" fill="#f6c29b" />
            <path d="M202 115 C202 97 238 97 238 115 C238 105 230 99 220 99 C210 99 202 105 202 115 Z" fill="#1e293b" />
            <path d="M205 137 L235 137 L238 220 L202 220 Z" fill="#0d9488" rx="8" />
            {/* Arms reaching high overhead */}
            <line x1="205" y1="140" x2="165" y2="40" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="140" x2="275" y2="40" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Hands near top */}
            <circle cx="165" cy="40" r="7" fill="#f6c29b" />
            <circle cx="275" cy="40" r="7" fill="#f6c29b" />
            <path d="M198 220 L242 220 L250 270 L190 270 Z" fill="#334155" />
            {/* Feet wide grounded */}
            <line x1="205" y1="270" x2="150" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="235" y1="270" x2="290" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M135 375 L160 375 L158 385 L132 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M280 375 L305 375 L308 385 L278 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="180" y="25" fill="#047857" fontSize="11" fontWeight="bold">Wide Star Touch</text>
          </g>
        );

      case 'jumping-jacks-step-4':
        // Landing return to center
        return (
          <g id="jack-figure-step-4">
            <ellipse cx="220" cy="385" rx="75" ry="11" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="135" x2="195" y2="210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <line x1="235" y1="135" x2="245" y2="210" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" />
            <path d="M200 215 L240 215 L242 265 L198 265 Z" fill="#334155" />
            <line x1="210" y1="265" x2="210" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="230" y1="265" x2="230" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M200 375 L220 375 L220 385 L198 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M220 375 L240 375 L242 385 L218 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(265, 105)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="175" y="75" fill="#0891b2" fontSize="10" fontWeight="bold">Soft Landing Reset</text>
          </g>
        );

      // ==========================================
      // HIGH KNEES (ex-high-knees)
      // ==========================================
      case 'high-knees-step-1':
        // Athletic Stance
        return (
          <g id="high-knees-fig-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Running arms poised */}
            <path d="M205 135 L180 170 L200 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 135 L260 170 L240 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="210" y1="265" x2="210" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="230" y1="265" x2="230" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M200 375 L220 375 L220 385 L198 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M220 375 L240 375 L242 385 L218 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="175" y="75" fill="#0891b2" fontSize="10" fontWeight="bold">Stay on Balls of Feet</text>
          </g>
        );

      case 'high-knees-step-2':
        // Right knee drive up to 90 deg
        return (
          <g id="high-knees-fig-2">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Left arm forward, right arm back */}
            <path d="M205 135 L175 160 L185 190" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 135 L260 170 L275 160" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            {/* Left standing leg straight */}
            <line x1="210" y1="265" x2="210" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M200 375 L220 375 L220 385 L198 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Right leg driving up: Thigh horizontal, calf vertical */}
            <line x1="230" y1="265" x2="295" y2="265" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="295" y1="265" x2="295" y2="335" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M285 335 L310 335 L312 345 L282 345 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <circle cx="295" cy="265" r="8" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
            <g transform="translate(305, 235)">
              <path d="M0 30 L0 5 M-6 14 L0 2 L6 14" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="8" y="18" fill="#0d9488" fontSize="10" fontWeight="bold">Knee to Hip Level</text>
            </g>
          </g>
        );

      case 'high-knees-step-3':
        // Left knee drive up
        return (
          <g id="high-knees-fig-3">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 135 L180 170 L165 160" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 135 L265 160 L255 190" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            {/* Right standing leg straight */}
            <line x1="230" y1="265" x2="230" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M220 375 L240 375 L242 385 L218 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Left leg driving up */}
            <line x1="210" y1="265" x2="145" y2="265" stroke="#f6c29b" strokeWidth="17" strokeLinecap="round" />
            <line x1="145" y1="265" x2="145" y2="335" stroke="#e2a77a" strokeWidth="15" strokeLinecap="round" />
            <path d="M135 335 L160 335 L162 345 L132 345 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <circle cx="145" cy="265" r="8" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" />
            <g transform="translate(70, 235)">
              <path d="M0 30 L0 5 M-6 14 L0 2 L6 14" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="-40" y="18" fill="#0d9488" fontSize="10" fontWeight="bold">Switch Legs</text>
            </g>
          </g>
        );

      case 'high-knees-step-4':
        // Continuous steady rhythm
        return (
          <g id="high-knees-fig-4">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="105" r="22" fill="#f6c29b" />
            <path d="M205 127 L235 127 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 135 L180 170 L200 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 135 L260 170 L240 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="210" y1="265" x2="210" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="230" y1="265" x2="260" y2="310" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="260" y1="310" x2="255" y2="365" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M200 375 L220 375 L220 385 L198 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M245 365 L270 365 L272 375 L242 375 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" />
            <line x1="220" y1="120" x2="220" y2="240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <text x="175" y="75" fill="#047857" fontSize="10" fontWeight="bold">Maintain Upright Spine</text>
          </g>
        );

      // ==========================================
      // SIDE LEG RAISES (ex-side-leg-raises)
      // ==========================================
      case 'side-leg-step-1':
        // Standing side alignment
        return (
          <g id="side-leg-fig-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 140 L185 175 L204 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 140 L255 175 L236 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="175" y="80" fill="#0891b2" fontSize="10" fontWeight="bold">Standing Tall & Centered</text>
          </g>
        );

      case 'side-leg-step-2':
        // Lifting active leg out to side
        return (
          <g id="side-leg-fig-2">
            <ellipse cx="220" cy="385" rx="90" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="215" cy="110" r="22" fill="#f6c29b" />
            <path d="M200 132 L230 132 L232 215 L198 215 Z" fill="#0d9488" rx="8" />
            <path d="M200 140 L180 175 L200 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M230 140 L250 175 L230 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M195 215 L235 215 L238 265 L192 265 Z" fill="#334155" />
            {/* Grounded left leg */}
            <line x1="205" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Raised right leg at 35 deg */}
            <line x1="230" y1="265" x2="295" y2="340" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M285 335 L310 345 L306 355 L280 345 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(290, 290)">
              <path d="M0 25 C10 15 15 5 15 -10 M5 0 L15 -12 L20 2" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="18" y="10" fill="#0d9488" fontSize="10" fontWeight="bold">Lift Lateral</text>
            </g>
          </g>
        );

      case 'side-leg-step-3':
        // Peak Abduction Hold at 45 deg
        return (
          <g id="side-leg-fig-3">
            <ellipse cx="220" cy="385" rx="100" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="215" cy="110" r="22" fill="#f6c29b" />
            <path d="M200 132 L230 132 L232 215 L198 215 Z" fill="#0d9488" rx="8" />
            <path d="M200 140 L180 175 L200 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M230 140 L250 175 L230 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M195 215 L235 215 L238 265 L192 265 Z" fill="#334155" />
            <line x1="205" y1="265" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Raised right leg at 45 deg */}
            <line x1="230" y1="265" x2="315" y2="310" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M305 305 L330 315 L326 325 L300 315 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Glute highlight circle */}
            <circle cx="240" cy="270" r="10" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            <line x1="215" y1="120" x2="205" y2="265" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" />
            <text x="250" y="255" fill="#047857" fontSize="10" fontWeight="bold">Squeeze Glute Medius</text>
          </g>
        );

      case 'side-leg-step-4':
        // Lowering slowly with control
        return (
          <g id="side-leg-fig-4">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 140 L185 175 L204 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 140 L255 175 L236 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="242" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M235 375 L258 375 L260 385 L235 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="175" y="80" fill="#047857" fontSize="10" fontWeight="bold">Lower with Control</text>
          </g>
        );

      // ==========================================
      // ARM CIRCLES (ex-arm-circles)
      // ==========================================
      case 'arm-circles-step-1':
        // T-Pose extension
        return (
          <g id="arm-circle-fig-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            {/* Arms extended straight to sides */}
            <line x1="205" y1="145" x2="105" y2="145" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="145" x2="335" y2="145" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="105" cy="145" r="7" fill="#f6c29b" />
            <circle cx="335" cy="145" r="7" fill="#f6c29b" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="160" y="80" fill="#0891b2" fontSize="10" fontWeight="bold">Shoulder-Height T-Extension</text>
          </g>
        );

      case 'arm-circles-step-2':
        // Small forward circular rotations
        return (
          <g id="arm-circle-fig-2">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="145" x2="110" y2="140" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="145" x2="330" y2="140" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Small circular rotation indicator around hands */}
            <circle cx="110" cy="140" r="18" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="330" cy="140" r="18" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x="160" y="80" fill="#0d9488" fontSize="10" fontWeight="bold">Small Forward Circles</text>
          </g>
        );

      case 'arm-circles-step-3':
        // Larger circles & chest open
        return (
          <g id="arm-circle-fig-3">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="145" x2="115" y2="135" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="145" x2="325" y2="135" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Wider circular sweep arc */}
            <circle cx="115" cy="135" r="30" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 3" />
            <circle cx="325" cy="135" r="30" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 3" />
            <text x="165" y="80" fill="#0284c7" fontSize="10" fontWeight="bold">Wide Expansive Arcs</text>
          </g>
        );

      case 'arm-circles-step-4':
        // Reverse direction sweep & relaxation
        return (
          <g id="arm-circle-fig-4">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="145" x2="120" y2="155" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="145" x2="320" y2="155" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <circle cx="120" cy="155" r="22" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="5 3" />
            <circle cx="320" cy="155" r="22" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="5 3" />
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="175" y="80" fill="#7c3aed" fontSize="10" fontWeight="bold">Reverse Circles & Breathe</text>
          </g>
        );

      // ==========================================
      // CALF RAISES (ex-calf-raises)
      // ==========================================
      case 'calf-raise-step-1':
        // Feet flat on floor
        return (
          <g id="calf-raise-fig-1">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 140 L185 175 L204 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 140 L255 175 L236 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            {/* Flat shoes */}
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="175" y="80" fill="#0891b2" fontSize="10" fontWeight="bold">Feet Flat on Floor</text>
          </g>
        );

      case 'calf-raise-step-2':
        // Heels elevating off floor
        return (
          <g id="calf-raise-fig-2">
            <ellipse cx="220" cy="385" rx="70" ry="10" fill="#cbd5e1" opacity="0.4" />
            <circle cx="220" cy="100" r="22" fill="#f6c29b" />
            <path d="M205 122 L235 122 L238 205 L202 205 Z" fill="#0d9488" rx="8" />
            <path d="M205 130 L185 165 L204 185" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 130 L255 165 L236 185" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 205 L240 205 L244 255 L196 255 Z" fill="#334155" />
            <line x1="208" y1="255" x2="206" y2="355" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="255" x2="234" y2="355" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            {/* Elevated feet: on toes */}
            <path d="M194 355 L214 365 L204 380 L188 368 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M226 355 L246 365 L236 380 L220 368 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(255, 335)">
              <path d="M0 25 L0 5 M-5 13 L0 3 L5 13" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="8" y="15" fill="#0d9488" fontSize="10" fontWeight="bold">Lift Heels</text>
            </g>
          </g>
        );

      case 'calf-raise-step-3':
        // Peak Calf Lockout at highest point
        return (
          <g id="calf-raise-fig-3">
            <ellipse cx="220" cy="385" rx="65" ry="9" fill="#cbd5e1" opacity="0.4" />
            <circle cx="220" cy="95" r="22" fill="#f6c29b" />
            <path d="M205 117 L235 117 L238 200 L202 200 Z" fill="#0d9488" rx="8" />
            <path d="M205 125 L185 160 L204 180" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 125 L255 160 L236 180" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 200 L240 200 L244 250 L196 250 Z" fill="#334155" />
            {/* Calves highlighted */}
            <line x1="208" y1="250" x2="206" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="250" x2="234" y2="345" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <circle cx="206" cy="305" r="9" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            <circle cx="234" cy="305" r="9" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            {/* Toes pressing floor */}
            <path d="M195 345 L215 355 L205 375 L190 360 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 345 L245 355 L235 375 L220 360 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="170" y="65" fill="#047857" fontSize="11" fontWeight="bold">Squeeze Calves at Top</text>
          </g>
        );

      case 'calf-raise-step-4':
        // Lowering heels softly
        return (
          <g id="calf-raise-fig-4">
            <ellipse cx="220" cy="385" rx="75" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="110" r="22" fill="#f6c29b" />
            <path d="M205 132 L235 132 L238 215 L202 215 Z" fill="#0d9488" rx="8" />
            <path d="M205 140 L185 175 L204 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M235 140 L255 175 L236 195" stroke="#f6c29b" strokeWidth="11" strokeLinecap="round" fill="none" />
            <path d="M200 215 L240 215 L244 265 L196 265 Z" fill="#334155" />
            <line x1="208" y1="265" x2="206" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="265" x2="234" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <path d="M192 375 L215 375 L215 385 L188 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M225 375 L248 375 L252 385 L225 385 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(265, 110)">
              <circle cx="16" cy="16" r="16" fill="#10b981" />
              <path d="M10 16 L15 21 L23 11" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="175" y="80" fill="#047857" fontSize="10" fontWeight="bold">Lower Softly to Mat</text>
          </g>
        );

      // ==========================================
      // MOUNTAIN CLIMBERS (ex-mountain-climbers)
      // ==========================================
      case 'climber-step-1':
        // High Plank setup
        return (
          <g id="climber-fig-1">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="230" r="18" fill="#f6c29b" />
            <line x1="130" y1="240" x2="240" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="140" y1="240" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="240" y1="255" x2="335" y2="310" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="310" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <line x1="110" y1="220" x2="375" y2="340" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 3" />
            <text x="160" y="215" fill="#0284c7" fontSize="10" fontWeight="bold">Flat Plank Stance</text>
          </g>
        );

      case 'climber-step-2':
        // Right knee driven to chest
        return (
          <g id="climber-fig-2">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="230" r="18" fill="#f6c29b" />
            <line x1="130" y1="240" x2="240" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="140" y1="240" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Left leg stays extended */}
            <line x1="240" y1="255" x2="335" y2="310" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="310" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Right knee driven forward under chest */}
            <path d="M235 260 L185 285 L180 340" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="185" cy="285" r="8" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            <g transform="translate(195, 275)">
              <path d="M30 0 L5 0 M15 -5 L4 0 L15 5" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="35" y="4" fill="#0d9488" fontSize="10" fontWeight="bold">Right Knee Drive</text>
            </g>
          </g>
        );

      case 'climber-step-3':
        // Left knee driven to chest (switch)
        return (
          <g id="climber-fig-3">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="230" r="18" fill="#f6c29b" />
            <line x1="130" y1="240" x2="240" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="140" y1="240" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            {/* Right leg extended back */}
            <line x1="240" y1="255" x2="335" y2="310" stroke="#334155" strokeWidth="22" strokeLinecap="round" />
            <line x1="335" y1="310" x2="375" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M370 345 L385 345 L388 355 L368 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Left knee driven forward */}
            <path d="M235 260 L185 285 L180 340" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="185" cy="285" r="8" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2" />
            <g transform="translate(195, 275)">
              <path d="M30 0 L5 0 M15 -5 L4 0 L15 5" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" fill="none" />
              <text x="35" y="4" fill="#0d9488" fontSize="10" fontWeight="bold">Left Knee Switch</text>
            </g>
          </g>
        );

      case 'climber-step-4':
        // Alternating cadence pace
        return (
          <g id="climber-fig-4">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <circle cx="115" cy="230" r="18" fill="#f6c29b" />
            <line x1="130" y1="240" x2="240" y2="255" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="140" y1="240" x2="140" y2="345" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="240" y1="255" x2="330" y2="305" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
            <line x1="330" y1="305" x2="370" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M365 345 L382 345 L384 355 L364 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <path d="M235 260 L195 280 L190 335" stroke="#f6c29b" strokeWidth="14" strokeLinecap="round" fill="none" />
            <g transform="translate(240, 205)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="160" y="215" fill="#047857" fontSize="10" fontWeight="bold">Steady Controlled Cadence</text>
          </g>
        );

      // ==========================================
      // CRUNCHES (ex-crunches)
      // ==========================================
      case 'crunches-step-1':
        // Supine setup, knees bent
        return (
          <g id="crunches-fig-1">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            {/* Mat */}
            <rect x="70" y="345" width="290" height="15" rx="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head on mat */}
            <circle cx="120" cy="330" r="18" fill="#f6c29b" />
            {/* Hands behind head */}
            <path d="M120 330 L105 320 L125 310" stroke="#f6c29b" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Flat back on mat */}
            <line x1="135" y1="335" x2="235" y2="335" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            {/* Hips */}
            <circle cx="235" cy="335" r="12" fill="#334155" />
            {/* Thigh angled up */}
            <line x1="235" y1="335" x2="280" y2="275" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            {/* Shin angled down to floor */}
            <line x1="280" y1="275" x2="315" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M305 345 L328 345 L330 355 L302 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <text x="130" y="270" fill="#0891b2" fontSize="10" fontWeight="bold">Lower Back Flat on Mat</text>
          </g>
        );

      case 'crunches-step-2':
        // Curling shoulders up (30 deg)
        return (
          <g id="crunches-fig-2">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="345" width="290" height="15" rx="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head lifted */}
            <circle cx="130" cy="295" r="18" fill="#f6c29b" />
            <path d="M130 295 L115 285 L135 275" stroke="#f6c29b" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Torso curled up 30 deg */}
            <path d="M140 305 Q175 325 235 335" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" fill="none" />
            <line x1="235" y1="335" x2="280" y2="275" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="280" y1="275" x2="315" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M305 345 L328 345 L330 355 L302 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(145, 260)">
              <path d="M0 25 C10 10 20 5 30 0 M20 -5 L32 0 L24 10" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <text x="35" y="10" fill="#0d9488" fontSize="10" fontWeight="bold">Curl Shoulders</text>
            </g>
          </g>
        );

      case 'crunches-step-3':
        // Peak Abdominal contraction
        return (
          <g id="crunches-fig-3">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="345" width="290" height="15" rx="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Head lifted at peak */}
            <circle cx="135" cy="275" r="18" fill="#f6c29b" />
            <path d="M135 275 L120 265 L140 255" stroke="#f6c29b" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M145 285 Q180 315 235 335" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" fill="none" />
            <line x1="235" y1="335" x2="280" y2="275" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="280" y1="275" x2="315" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M305 345 L328 345 L330 355 L302 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            {/* Core highlight */}
            <circle cx="195" cy="310" r="15" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="2.5" />
            <text x="145" y="240" fill="#047857" fontSize="11" fontWeight="bold">Peak Core Contraction</text>
          </g>
        );

      case 'crunches-step-4':
        // Lowering with control
        return (
          <g id="crunches-fig-4">
            <ellipse cx="230" cy="355" rx="140" ry="14" fill="#cbd5e1" opacity="0.6" />
            <rect x="70" y="345" width="290" height="15" rx="7" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="125" cy="315" r="18" fill="#f6c29b" />
            <path d="M125 315 L110 305 L130 295" stroke="#f6c29b" strokeWidth="8" strokeLinecap="round" fill="none" />
            <line x1="135" y1="325" x2="235" y2="335" stroke="#0d9488" strokeWidth="24" strokeLinecap="round" />
            <line x1="235" y1="335" x2="280" y2="275" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="280" y1="275" x2="315" y2="345" stroke="#e2a77a" strokeWidth="14" strokeLinecap="round" />
            <path d="M305 345 L328 345 L330 355 L302 355 Z" fill="#ffffff" stroke="#0d9488" strokeWidth="3" />
            <g transform="translate(180, 260)">
              <circle cx="14" cy="14" r="14" fill="#10b981" />
              <path d="M9 14 L13 18 L19 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="135" y="245" fill="#0891b2" fontSize="10" fontWeight="bold">Lower Slowly & Inhale</text>
          </g>
        );

      default:
        // Rule 21: Error prevention fallback for missing asset
        return (
          <g id="fallback-posture">
            <ellipse cx="220" cy="385" rx="85" ry="12" fill="#cbd5e1" opacity="0.6" />
            <circle cx="220" cy="120" r="24" fill="#f6c29b" />
            <path d="M200 145 L240 145 L235 245 L205 245 Z" fill="#0d9488" rx="8" />
            <line x1="205" y1="150" x2="185" y2="240" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <line x1="235" y1="150" x2="255" y2="240" stroke="#f6c29b" strokeWidth="12" strokeLinecap="round" />
            <path d="M198 245 L242 245 L240 295 L196 295 Z" fill="#334155" />
            <line x1="208" y1="295" x2="205" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <line x1="232" y1="295" x2="235" y2="375" stroke="#f6c29b" strokeWidth="16" strokeLinecap="round" />
            <text x="145" y="60" fill="#64748b" fontSize="12" fontWeight="bold">Posture Guide Asset: {imageKey}</text>
          </g>
        );
    }
  };

  // Motion arrow badge
  const renderMotionDirectionBadge = () => {
    switch (motionDirection) {
      case 'down':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20 shadow-xs">
            <ArrowDown className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
            <span>{motionArrowLabel || 'Downward Motion'}</span>
          </span>
        );
      case 'up':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 text-xs font-bold border border-teal-500/20 shadow-xs">
            <ArrowUp className="h-3.5 w-3.5 text-teal-600 animate-bounce" />
            <span>{motionArrowLabel || 'Upward Drive'}</span>
          </span>
        );
      case 'forward':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-700 text-xs font-bold border border-sky-500/20 shadow-xs">
            <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
            <span>{motionArrowLabel || 'Forward Cadence'}</span>
          </span>
        );
      case 'twist':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 text-xs font-bold border border-purple-500/20 shadow-xs">
            <RotateCw className="h-3.5 w-3.5 text-purple-600" />
            <span>{motionArrowLabel || 'Rotational Flow'}</span>
          </span>
        );
      case 'stretch':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>{motionArrowLabel || 'Elongate & Release'}</span>
          </span>
        );
      case 'hold':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-700 text-xs font-bold border border-indigo-500/20 shadow-xs">
            <Pause className="h-3.5 w-3.5 text-indigo-600" />
            <span>{motionArrowLabel || 'Isometric Balance'}</span>
          </span>
        );
    }
  };

  return (
    <div
      id={`posture-visual-${imageKey}`}
      className={`relative w-full rounded-3xl bg-linear-to-b from-slate-50 via-teal-50/20 to-slate-100 border border-slate-200/80 shadow-inner overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold tracking-wide shadow-xs">
            Step {stepNumber}
          </span>
          {renderMotionDirectionBadge()}
        </div>

        {bodyHighlight && (
          <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-bold border border-slate-200 shadow-xs flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            {bodyHighlight}
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-4/3 max-h-[380px] flex items-center justify-center p-2">
        <svg
          viewBox="0 0 440 440"
          className="w-full h-full max-h-full object-contain filter drop-shadow-sm"
          preserveAspectRatio="xMidYMid meet"
          aria-label={`${title} posture demonstration step ${stepNumber}`}
        >
          <defs>
            <radialGradient id="studio-spotlight" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#f0fdfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.8" />
            </radialGradient>
            <linearGradient id="ground-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Studio floor / background grid */}
          <rect x="0" y="0" width="440" height="440" fill="url(#studio-spotlight)" rx="24" />
          <line x1="40" y1="385" x2="400" y2="385" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6 4" />

          {/* Dynamic Breathing Aura behind Human Dummy */}
          {showBreathingRing && breathPhase && (
            <g transform={`translate(220, 230) scale(${auraScale}) translate(-220, -230)`}>
              <circle
                cx="220"
                cy="230"
                r="165"
                fill={getAuraColor()}
                className="transition-all duration-300 ease-out"
              />
              <circle
                cx="220"
                cy="230"
                r="165"
                fill="none"
                stroke={breathPhase === 'Inhale' ? '#14b8a6' : breathPhase === 'Exhale' ? '#6366f1' : '#38bdf8'}
                strokeWidth="2.5"
                strokeDasharray="6 4"
                opacity="0.5"
              />
            </g>
          )}

          {/* Render Human Posture Vector */}
          {renderPostureFigure()}
        </svg>
      </div>

      {/* Posture cue & alignment bar at bottom */}
      {(postureCue || keyAlignment) && (
        <div className="w-full px-4 py-2 bg-slate-900/5 backdrop-blur-xs border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-700">
          {postureCue && (
            <div className="flex items-center gap-1.5 text-teal-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>{postureCue}</span>
            </div>
          )}
          {keyAlignment && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Info className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>Alignment: {keyAlignment}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
