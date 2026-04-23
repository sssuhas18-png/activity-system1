'use client';

import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface SubmissionStats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    pointsEarned: number;
}

interface SubmissionStatsProps {
    stats: SubmissionStats;
}

export default function SubmissionStats({ stats }: SubmissionStatsProps) {
    const statCards = [
        {
            label: 'Total Submissions',
            value: stats.total,
            icon: TrendingUp,
            color: 'neon-purple',
            bgColor: 'bg-neon-purple/10',
            borderColor: 'border-neon-purple/30',
        },
        {
            label: 'Approved',
            value: stats.approved,
            icon: CheckCircle,
            color: 'green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
        },
        {
            label: 'Pending',
            value: stats.pending,
            icon: AlertCircle,
            color: 'yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            color: 'red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
            {statCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4 text-center`}
                    >
                        <Icon className={`w-5 h-5 text-${card.color} mx-auto mb-2`} />
                        <p className="text-2xl font-bold text-foreground">{card.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                    </motion.div>
                );
            })}

            {/* Points Earned */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="col-span-2 md:col-span-1 bg-neon-green/10 border border-neon-green/30 rounded-lg p-4 text-center"
            >
                <p className="text-2xl font-bold text-neon-green">{stats.pointsEarned}</p>
                <p className="text-xs text-muted-foreground mt-1">Points Earned</p>
            </motion.div>
        </motion.div>
    );
}
