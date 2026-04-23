'use client';

import { motion } from 'framer-motion';
import { User, Mail, Award, Zap } from 'lucide-react';

interface StudentProfileCardProps {
    student: {
        name: string;
        usn: string;
        email?: string;
        total_points: number;
    };
    isLoading?: boolean;
}

export default function StudentProfileCard({ student, isLoading }: StudentProfileCardProps) {
    if (isLoading) {
        return (
            <div className="glass-card border border-neon-green/30 p-8 rounded-2xl animate-pulse">
                <div className="h-6 bg-neon-green/20 rounded w-48 mb-4" />
                <div className="h-4 bg-neon-green/10 rounded w-64 mb-2" />
                <div className="h-4 bg-neon-green/10 rounded w-56" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-neon-green/30 p-8 rounded-2xl"
        >
            <div className="grid md:grid-cols-4 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center flex-shrink-0">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Student Name</p>
                            <h2 className="text-2xl font-bold text-foreground">{student.name}</h2>
                            <p className="text-xs text-neon-green mt-1">Academic Year 2024</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-neon-green" />
                        <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                    <p className="text-3xl font-bold text-neon-green">{student.total_points}</p>
                    <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                </div>

                {/* Rank */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-neon-cyan" />
                        <p className="text-xs text-muted-foreground">Merit Badge</p>
                    </div>
                    <div className="text-sm font-semibold text-neon-cyan">
                        {student.total_points >= 80 ? '🏆 High Achiever' : student.total_points >= 50 ? '⭐ Participant' : '🌟 Beginner'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Performance level</p>
                </div>
            </div>

            {/* Contact Details */}
            <div className="mt-6 pt-6 border-t border-neon-green/20">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                            <span className="font-mono text-neon-green">USN</span>
                        </p>
                        <p className="text-sm font-mono font-bold text-foreground">{student.usn}</p>
                    </div>
                    {student.email && (
                        <div>
                            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                                <Mail className="w-3 h-3" />
                                <span>Email</span>
                            </p>
                            <p className="text-sm text-neon-cyan break-all">{student.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
