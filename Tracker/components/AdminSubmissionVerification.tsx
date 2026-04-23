'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '@/services/api';

interface AdminSubmissionVerificationProps {
    submission: {
        _id: string;
        usn: string;
        activity_type: string;
        criteria: string;
        proof_url?: string;
    };
    onVerified: () => void;
}

export default function AdminSubmissionVerification({ submission, onVerified }: AdminSubmissionVerificationProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [remarks, setRemarks] = useState('');

    const handleVerify = async (status: 'approved' | 'rejected') => {
        setIsLoading(true);
        try {
            await adminAPI.verifySubmission(submission._id, {
                status,
                remarks,
            });

            toast.success(`Submission ${status} successfully`);
            setRemarks('');
            onVerified();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to verify submission');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-futuristic border border-neon-orange/30 rounded-lg p-4 space-y-4"
        >
            <div>
                <h3 className="font-semibold text-white mb-2">
                    {submission.activity_type} - {submission.criteria}
                </h3>
                <p className="text-sm text-neon-gray mb-3">From: {submission.usn}</p>

                {submission.proof_url && (
                    <a
                        href={submission.proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-neon-orange/20 hover:bg-neon-orange/30 rounded text-xs text-neon-orange transition-colors mb-4"
                    >
                        <Download className="w-4 h-4" />
                        View Proof
                    </a>
                )}
            </div>

            <div>
                <label className="text-xs text-neon-gray mb-2 block">Remarks (optional)</label>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add remarks for the student..."
                    className="w-full px-3 py-2 bg-futuristic/50 border border-neon-purple/20 rounded text-sm text-white placeholder-neon-gray/50 focus:border-neon-purple/60 focus:outline-none resize-none"
                    rows={3}
                />
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => handleVerify('approved')}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded text-sm text-green-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <CheckCircle className="w-4 h-4" />
                    Approve
                </button>
                <button
                    onClick={() => handleVerify('rejected')}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-sm text-red-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <XCircle className="w-4 h-4" />
                    Reject
                </button>
            </div>
        </motion.div>
    );
}
