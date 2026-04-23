'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Download, ChevronDown, AlertCircle, Upload } from 'lucide-react';
import api from '@/services/api';

interface StudentSubmissionListProps {
    submissions: Array<{
        _id: string;
        activity_type: { _id: string, name: string } | string;
        criteria: { _id: string, title: string, points: number } | string;
        status: 'pending' | 'approved' | 'rejected';
        proof_url?: string;
        points_awarded?: number;
        remarks?: string;
        createdAt?: string;
    }>;
}

export default function StudentSubmissionList({ submissions }: StudentSubmissionListProps) {
    const API_BASE_URL = api.defaults.baseURL || 'http://localhost:5400';
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-yellow-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30',
            approved: 'bg-green-500/10 text-green-300 border border-green-500/30',
            rejected: 'bg-red-500/10 text-red-300 border border-red-500/30',
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Your submission has been verified and approved';
            case 'rejected':
                return 'Please review the remarks and resubmit';
            default:
                return 'Waiting for admin verification';
        }
    };

    if (submissions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border border-dashed border-neon-purple/20 rounded-lg bg-neon-purple/5"
            >
                <div className="p-4 rounded-full bg-neon-purple/10 inline-block mb-4">
                    <Upload className="w-8 h-8 text-neon-purple" />
                </div>
                <p className="text-white font-semibold mb-2">No submissions yet</p>
                <p className="text-xs text-neon-gray">Select an activity and upload your certificate to get started</p>
            </motion.div>
        );
    }

    // Group submissions by status
    const approvedCount = submissions.filter(s => s.status === 'approved').length;
    const pendingCount = submissions.filter(s => s.status === 'pending').length;
    const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

    return (
        <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center"
                >
                    <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
                    <p className="text-xs text-neon-gray">Approved</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center"
                >
                    <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                    <p className="text-xs text-neon-gray">Pending</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center"
                >
                    <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
                    <p className="text-xs text-neon-gray">Rejected</p>
                </motion.div>
            </div>

            {/* Submissions List */}
            <div className="space-y-3">
                {submissions.map((submission, idx) => (
                    <motion.div
                        key={submission._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group"
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === submission._id ? null : submission._id)}
                            className="w-full text-left"
                        >
                            <div className="bg-futuristic/50 hover:bg-futuristic/80 border border-neon-purple/20 hover:border-neon-purple/40 rounded-lg p-4 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">{getStatusIcon(submission.status)}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-white truncate">{typeof submission.activity_type === 'string' ? submission.activity_type : submission.activity_type?.name}</h3>
                                                <p className="text-xs text-neon-gray mt-1">{typeof submission.criteria === 'string' ? submission.criteria : submission.criteria?.title}</p>
                                                {submission.createdAt && (
                                                    <p className="text-xs text-neon-gray/60 mt-2">
                                                        {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Content */}
                                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                                        {submission.points_awarded && (
                                            <div className="text-right hidden sm:block">
                                                <p className="text-2xl font-bold text-neon-orange">{submission.points_awarded}</p>
                                                <p className="text-xs text-neon-gray">points</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadge(submission.status)}`}>
                                                {submission.status === 'approved' && '✓ Approved'}
                                                {submission.status === 'pending' && '⏳ Pending'}
                                                {submission.status === 'rejected' && '✗ Rejected'}
                                            </span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-neon-gray transition-transform ${expandedId === submission._id ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {expandedId === submission._id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 bg-neon-purple/5 border border-neon-purple/20 rounded-lg p-4 space-y-4"
                            >
                                {/* Status Info */}
                                <div>
                                    <div className="flex items-start gap-3 mb-2">
                                        <AlertCircle className="w-4 h-4 text-neon-purple flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-white">Current Status</p>
                                            <p className="text-xs text-neon-gray mt-1">
                                                {getStatusDescription(submission.status)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Remarks */}
                                {submission.remarks && (
                                    <div className="border-t border-neon-purple/20 pt-4">
                                        <p className="text-xs font-semibold text-neon-purple mb-2">Admin Remarks:</p>
                                        <p className="text-sm text-white bg-futuristic/50 border border-neon-purple/20 rounded p-3">
                                            {submission.remarks}
                                        </p>
                                    </div>
                                )}

                                {/* Points Awarded */}
                                {submission.points_awarded && (
                                    <div className="border-t border-neon-purple/20 pt-4">
                                        <div className="bg-neon-orange/10 border border-neon-orange/20 rounded-lg p-3 text-center">
                                            <p className="text-xs text-neon-gray mb-1">Points Awarded</p>
                                            <p className="text-2xl font-bold text-neon-orange">{submission.points_awarded}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Download Proof */}
                                {submission.proof_url && (
                                    <div className="border-t border-neon-purple/20 pt-4">
                                        <a
                                            href={submission.proof_url.startsWith('http') ? encodeURI(submission.proof_url) : encodeURI(`${API_BASE_URL}${submission.proof_url}`)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg text-sm text-neon-purple font-medium transition-all"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Proof
                                        </a>
                                    </div>
                                )}

                                {/* Mobile Points Display */}
                                {submission.points_awarded && (
                                    <div className="sm:hidden border-t border-neon-purple/20 pt-4">
                                        <div className="bg-neon-orange/10 border border-neon-orange/20 rounded-lg p-3 text-center">
                                            <p className="text-xs text-neon-gray mb-1">Points Awarded</p>
                                            <p className="text-2xl font-bold text-neon-orange">{submission.points_awarded}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
