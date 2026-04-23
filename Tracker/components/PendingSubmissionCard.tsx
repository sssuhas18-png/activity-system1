'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Check, X, MessageSquare, User, Award, ExternalLink, Loader2, Clock, FileText, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import api, { adminAPI } from '@/services/api';

interface Submission {
  id: number | string;
  usn: string;
  activity_type: string;
  criteria: string;
  certificate_url?: string;
  created_at?: string;
}

interface PendingSubmissionCardProps {
  submission: Submission;
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
  delay?: number;
  isDemo?: boolean;
}

export default function PendingSubmissionCard({
  submission,
  onApprove,
  onReject,
  delay = 0,
  isDemo = false,
}: PendingSubmissionCardProps) {
  const API_BASE_URL = api.defaults.baseURL || 'http://localhost:5400';
  const [remarks, setRemarks] = useState('');
  const [showRemarks, setShowRemarks] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    
    if (isDemo) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Demo: Submission approved! Points awarded to student.');
      setIsApproving(false);
      return;
    }

    try {
      await adminAPI.verifySubmission(String(submission.id), { status: 'approved', remarks });
      toast.success('Submission approved successfully');
      await onApprove();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Please provide remarks for rejection');
      setShowRemarks(true);
      return;
    }
    setIsRejecting(true);

    if (isDemo) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Demo: Submission rejected with remarks.');
      setIsRejecting(false);
      return;
    }

    try {
      await adminAPI.verifySubmission(String(submission.id), { status: 'rejected', remarks });
      toast.success('Submission rejected');
      await onReject();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setIsRejecting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getYearAndSem = (usn: string) => {
    if (!usn || usn.length < 5) return '';
    const code = usn.substring(3, 5);
    const admissionYear = 2000 + parseInt(code);
    if (isNaN(admissionYear)) return '';
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const yearDiff = currentYear - admissionYear;
    
    let currentSem = currentMonth < 8 ? yearDiff * 2 : (yearDiff * 2) + 1;
    if (currentSem < 1) currentSem = 1;
    if (currentSem > 8) currentSem = 8;
    
    const currentStudyYear = Math.ceil(currentSem / 2);
    const yearMap: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };
    const yearSuffix = yearMap[currentStudyYear] || `${currentStudyYear}th`;
    
    return `${yearSuffix} Yr, S${currentSem}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 rounded-xl border border-orange-500/20 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Certificate Preview */}
        <div className="relative w-full lg:w-40 h-40 flex-shrink-0 rounded-xl overflow-hidden bg-white/5 border border-white/10">
          {submission.certificate_url ? (
            <>
              {submission.certificate_url.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 p-4">
                  <FileText className="w-12 h-12 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium text-muted-foreground text-center break-words">PDF Document</span>
                </div>
              ) : (
                <img
                  src={submission.certificate_url.startsWith('http') ? encodeURI(submission.certificate_url) : encodeURI(`${API_BASE_URL}${submission.certificate_url}`)}
                  alt="Certificate"
                  className="w-full h-full object-cover"
                />
              )}
              <a
                href={submission.certificate_url.startsWith('http') ? encodeURI(submission.certificate_url) : encodeURI(`${API_BASE_URL}${submission.certificate_url}`)}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur rounded-lg">
                  <ExternalLink className="w-4 h-4 text-white" />
                  <span className="text-sm text-white">View Full</span>
                </div>
              </a>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Award className="w-10 h-10 text-white/30 mb-2" />
              <span className="text-xs text-white/30">No preview</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Student Info & Time */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20">
                <User className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-sm text-orange-400 font-medium">{submission.usn}</span>
              {getYearAndSem(submission.usn) && (
                <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border border-orange-500/20 text-orange-400/80 bg-orange-500/10">
                  <GraduationCap className="w-3 h-3" />
                  {getYearAndSem(submission.usn)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-white/40 text-xs">
              <Clock className="w-3 h-3" />
              {formatDate(submission.created_at)}
            </div>
          </div>

          {/* Activity Details */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{submission.activity_type}</h3>
            <p className="text-white/60">{submission.criteria}</p>
          </div>

          {/* Remarks Input */}
          <div className="mb-4">
            <button
              onClick={() => setShowRemarks(!showRemarks)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              {showRemarks ? 'Hide remarks' : 'Add remarks'}
            </button>
            {showRemarks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3"
              >
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks (required for rejection)..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-white placeholder:text-white/30 resize-none"
                  rows={2}
                />
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isApproving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Approve
            </motion.button>
            <motion.button
              onClick={handleReject}
              disabled={isApproving || isRejecting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRejecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Reject
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
