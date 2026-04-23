'use client';

// Submission card with status indicator
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';

interface SubmissionCardProps {
  activityType: string;
  criteria: string;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl?: string;
  remarks?: string;
  index: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Pending Review',
    color: 'text-neon-yellow',
    bg: 'bg-neon-yellow/10',
    border: 'border-neon-yellow/30',
  },
  approved: {
    icon: CheckCircle,
    label: 'Approved',
    color: 'text-neon-green',
    bg: 'bg-neon-green/10',
    border: 'border-neon-green/30',
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
  },
};

export default function SubmissionCard({
  activityType,
  criteria,
  status,
  imageUrl,
  remarks,
  index,
}: SubmissionCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card p-4 border ${config.border}`}
    >
      <div className="flex gap-4">
        {/* Image Preview */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Certificate"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-5 h-5 text-foreground" />
            </a>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground truncate">{activityType}</h4>
              <p className="text-sm text-muted-foreground truncate">{criteria}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg}`}>
              <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
              <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
            </div>
          </div>
          
          {remarks && (
            <div className="mt-2 p-2 bg-secondary/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Remarks:</span> {remarks}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
