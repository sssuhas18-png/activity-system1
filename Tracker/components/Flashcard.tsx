'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Zap, Trophy, Sparkles, Target, Award, Star } from 'lucide-react';

interface FlashcardProps {
  title: string;
  criteriaCount: number;
  onClick: () => void;
  isSelected?: boolean;
  index: number;
}

const icons = [Zap, Trophy, Sparkles, Target, Award, Star];
const glowColors = [
  'neon-glow-green',
  'neon-glow-blue',
  'neon-glow-purple',
  'neon-glow-orange',
];

export default function Flashcard({ title, criteriaCount, onClick, isSelected, index }: FlashcardProps) {
  const Icon = icons[index % icons.length];
  const glowClass = glowColors[index % glowColors.length];

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left glass-card p-6 transition-all duration-300 ${
        isSelected ? glowClass : 'hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 15 }}
            className={`p-3 rounded-xl ${
              isSelected ? 'bg-neon-green/20' : 'bg-secondary'
            }`}
          >
            <Icon className={`w-6 h-6 ${isSelected ? 'text-neon-green' : 'text-muted-foreground'}`} />
          </motion.div>
          <div>
            <h3 className={`text-lg font-semibold ${isSelected ? 'text-neon-green' : 'text-foreground'}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {criteriaCount} {criteriaCount === 1 ? 'activity' : 'activities'} available
            </p>
          </div>
        </div>
        <motion.div
          animate={{ x: isSelected ? 5 : 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-neon-green' : 'text-muted-foreground'}`} />
        </motion.div>
      </div>

      {/* Activity count badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full"
      >
        <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-neon-green' : 'bg-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">Click to expand</span>
      </motion.div>
    </motion.button>
  );
}
