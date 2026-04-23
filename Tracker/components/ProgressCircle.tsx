'use client';

// Progress circle component with animated SVG
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressCircle({ 
  current, 
  target, 
  size = 200, 
  strokeWidth = 12 
}: ProgressCircleProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const remaining = Math.max(target - current, 0);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="progress-glow text-neon-green"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.25 145)" />
            <stop offset="50%" stopColor="oklch(0.8 0.15 200)" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 240)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-bold text-foreground neon-text-green"
        >
          {current}
        </motion.span>
        <span className="text-sm text-muted-foreground">/ {target} points</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-neon-cyan mt-2"
        >
          {remaining} remaining
        </motion.span>
      </div>

      {/* Percentage badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-2 glass-card px-3 py-1 rounded-full"
      >
        <span className="text-xs font-medium text-neon-green">
          {percentage.toFixed(1)}% Complete
        </span>
      </motion.div>
    </div>
  );
}
