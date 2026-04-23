'use client';

// Sub-flashcard component for criteria selection
import { motion } from 'framer-motion';
import { Award, Upload } from 'lucide-react';

interface SubFlashcardProps {
  criteria: string;
  points: number;
  onClick: () => void;
  index: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export default function SubFlashcard({ criteria, points, onClick, index, status }: SubFlashcardProps) {
  const isApproved = status === 'approved';
  const isPending = status === 'pending';
  const isDisabled = isApproved || isPending;

  const handleClick = () => {
    if (!isDisabled) {
      onClick();
    }
  };
  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={!isDisabled ? { scale: 1.01, x: 5 } : {}}
      whileTap={!isDisabled ? { scale: 0.99 } : {}}
      disabled={isDisabled}
      className={`w-full text-left glass-card p-4 group transition-all duration-300 ${
        isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:neon-glow-blue'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${
             isApproved ? 'bg-green-500/20' : isPending ? 'bg-yellow-500/20' : 'bg-neon-cyan/10 group-hover:bg-neon-cyan/20'
          }`}>
            <Award className={`w-4 h-4 ${isApproved ? 'text-green-400' : isPending ? 'text-yellow-400' : 'text-neon-cyan'}`} />
          </div>
          <div>
            <h4 className={`font-medium transition-colors ${
              isApproved ? 'text-green-400' : isPending ? 'text-yellow-400' : 'text-foreground group-hover:text-neon-cyan'
            }`}>
              {criteria}
            </h4>
            <p className={`text-xs ${isApproved ? 'text-green-500 font-semibold' : isPending ? 'text-yellow-500 font-semibold' : 'text-muted-foreground'}`}>
              {isApproved ? 'Completed ✅' : isPending ? 'Pending ⏳' : 'Click to submit'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className={`text-lg font-bold ${isApproved ? 'text-green-400' : 'text-neon-green'}`}>+{points}</span>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
          {!isDisabled && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              className="p-2 rounded-lg bg-neon-green/20"
            >
              <Upload className="w-4 h-4 text-neon-green" />
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
