'use client';

import { motion } from 'framer-motion';

interface LoadingScreenProps {
  variant?: 'student' | 'admin' | 'default';
}

export function LoadingScreen({ variant = 'default' }: LoadingScreenProps) {
  const colorClass = {
    student: 'text-neon-green',
    admin: 'text-neon-orange',
    default: 'text-neon-purple',
  }[variant];

  const glowClass = {
    student: 'neon-glow-green',
    admin: 'neon-glow-orange',
    default: 'neon-glow-purple',
  }[variant];

  return (
    <div className="min-h-screen bg-futuristic flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card ${glowClass} p-12 text-center`}
      >
        {/* Animated loader */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-0 rounded-full border-4 border-transparent border-t-current ${colorClass}`}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-2 rounded-full border-4 border-transparent border-t-current ${colorClass} opacity-60`}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`absolute inset-4 rounded-full border-4 border-transparent border-t-current ${colorClass} opacity-30`}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`font-medium ${colorClass}`}
        >
          Loading...
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`h-1 ${colorClass.replace('text-', 'bg-')} mt-4 rounded-full opacity-50`}
        />
      </motion.div>
    </div>
  );
}
