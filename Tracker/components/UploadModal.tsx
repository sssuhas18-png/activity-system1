'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { studentAPI } from '@/services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: string;
  criteria: string;
  points?: number;
  onSubmit?: () => Promise<void>;
  onSuccess?: () => void;
  isDemo?: boolean;
}

export default function UploadModal({ 
  isOpen, 
  onClose, 
  activityType, 
  criteria, 
  points = 0,
  onSubmit,
  onSuccess, 
  isDemo = false 
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    } else {
      toast.error('Please upload an image file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please upload a certificate');
      return;
    }

    setIsSubmitting(true);
    
    if (isDemo) {
      // Demo mode - simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Demo: Submission would be sent to admin for review!');
      if (onSubmit) await onSubmit();
      handleClose();
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('activity_type', activityType);
      formData.append('criteria', criteria);
      formData.append('file', file);

      await studentAPI.submitActivity(formData);
      toast.success('Submission successful!');
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-card p-6 rounded-2xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Submit Activity</h2>
                <p className="text-sm text-white/50">Upload your certificate</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Auto-filled fields */}
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Activity Type</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                  {activityType}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Criteria</label>
                <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
                  {criteria}
                </div>
              </div>

              {points > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">+{points} points on approval</span>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-white">Certificate Upload</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                  isDragging
                    ? 'border-green-400 bg-green-500/10'
                    : preview
                    ? 'border-green-500/50'
                    : 'border-white/20 hover:border-green-500/50'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {preview ? (
                  <div className="p-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50">
                      <img
                        src={preview}
                        alt="Certificate preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400 truncate">{file?.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="p-4 rounded-full bg-white/5 mb-4">
                      <ImageIcon className="w-8 h-8 text-white/50" />
                    </div>
                    <p className="text-white font-medium mb-1">
                      Drag and drop your certificate
                    </p>
                    <p className="text-sm text-white/50">
                      or click to browse files
                    </p>
                    <p className="text-xs text-white/30 mt-2">
                      Supports: JPG, PNG, GIF
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
              <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-white/60">
                Your submission will be reviewed by an admin. Points will be awarded upon approval.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={!file || isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Submit
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
