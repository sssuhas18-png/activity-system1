'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardCardProps {
  rank: number;
  name: string;
  usn: string;
  totalPoints: number;
  index: number;
}

const rankConfig = {
  1: {
    icon: Crown,
    color: 'text-neon-yellow',
    bg: 'bg-neon-yellow/20',
    glow: 'neon-glow-orange',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
  },
  2: {
    icon: Trophy,
    color: 'text-slate-300',
    bg: 'bg-slate-300/20',
    glow: '',
    gradient: 'from-slate-300/20 via-slate-400/10 to-transparent',
  },
  3: {
    icon: Medal,
    color: 'text-orange-400',
    bg: 'bg-orange-400/20',
    glow: '',
    gradient: 'from-orange-500/20 via-orange-400/10 to-transparent',
  },
};

export default function LeaderboardCard({ rank, name, usn, totalPoints, index }: LeaderboardCardProps) {
  const config = rankConfig[rank as keyof typeof rankConfig] || {
    icon: Award,
    color: 'text-muted-foreground',
    bg: 'bg-secondary',
    glow: '',
    gradient: 'from-secondary/50 to-transparent',
  };

  const Icon = config.icon;
  const isTopThree = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-4 ${config.glow} relative overflow-hidden`}
    >
      {/* Background gradient for top 3 */}
      {isTopThree && (
        <div
          className={`absolute inset-0 bg-gradient-to-r ${config.gradient} pointer-events-none`}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Rank */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}
        >
          {isTopThree ? (
            <Icon className={`w-6 h-6 ${config.color}`} />
          ) : (
            <span className={`text-lg font-bold ${config.color}`}>#{rank}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${isTopThree ? config.color : 'text-foreground'}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{usn}</p>
        </div>

        {/* Points */}
        <div className="text-right flex-shrink-0">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
            className={`text-2xl font-bold ${isTopThree ? config.color : 'text-neon-green'}`}
          >
            {totalPoints}
          </motion.span>
          <p className="text-xs text-muted-foreground">points</p>
        </div>

        {/* Rank badge for top 3 */}
        {isTopThree && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
            className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}
          >
            <span className={`text-xs font-bold ${config.color}`}>#{rank}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
