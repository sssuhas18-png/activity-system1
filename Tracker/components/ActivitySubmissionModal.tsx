'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { studentAPI } from '@/services/api';

interface ActivitySubmissionModalProps {
    isOpen: boolean;
    activityType: string;
    criteria: string;
    onClose: () => void;
    onSuccess: () => void;
}

type SubmissionStep = 'upload' | 'uploading' | 'success';

export default function ActivitySubmissionModal({
    isOpen,
    activityType,
    criteria,
    onClose,
    onSuccess,
}: ActivitySubmissionModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [step, setStep] = useState<SubmissionStep>('upload');
    const [dragActive, setDragActive] = useState(false);
    const [submissionId, setSubmissionId] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Validate file type (only images and PDFs)
            const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'];
            if (!validTypes.includes(selectedFile.type)) {
                toast.error('Please upload an image or PDF file');
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect({
                target: { files: e.dataTransfer.files },
            } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setStep('uploading');
        try {
            const formData = new FormData();
            formData.append('activity_type', activityType);
            formData.append('criteria', criteria);
            formData.append('file', file);

            const response = await studentAPI.submitActivity(formData);

            setSubmissionId(response.submission?._id || '');
            setStep('success');

            // Auto close after 3 seconds
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to submit activity');
            setStep('upload');
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        setFile(null);
        setStep('upload');
        setSubmissionId('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-futuristic border border-neon-purple/30 rounded-2xl overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    disabled={step === 'uploading'}
                    className="absolute top-4 right-4 p-2 hover:bg-neon-purple/10 rounded-lg transition-colors disabled:opacity-50"
                >
                    <X className="w-5 h-5 text-neon-purple" />
                </button>

                <AnimatePresence mode="wait">
                    {/* Upload Step */}
                    {step === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-1">{activityType}</h2>
                            <p className="text-sm text-neon-gray mb-6">{criteria}</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Drag & Drop Area */}
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                                        ? 'border-neon-orange bg-neon-orange/5'
                                        : 'border-neon-purple/30 hover:border-neon-purple/60'
                                        } cursor-pointer`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*,.pdf"
                                    />
                                    <motion.div
                                        animate={{
                                            y: dragActive ? -8 : 0,
                                        }}
                                    >
                                        <Upload className="w-12 h-12 mx-auto mb-3 text-neon-orange" />
                                        <p className="text-sm font-semibold text-white mb-1">
                                            {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
                                        </p>
                                        <p className="text-xs text-neon-gray">
                                            PNG, JPG, GIF or PDF (max 10MB)
                                        </p>
                                    </motion.div>
                                </div>

                                {/* File Preview */}
                                {file && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-4 flex items-start gap-3"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 bg-neon-purple/20 rounded flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-neon-purple" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                                            <p className="text-xs text-neon-gray mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="flex-shrink-0 p-1 hover:bg-neon-purple/20 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-neon-gray" />
                                        </button>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!file}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-neon-orange to-neon-purple rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Certificate
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Uploading Step */}
                    {step === 'uploading' && (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 text-center"
                        >
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                >
                                    <div className="w-16 h-16 rounded-full border-4 border-neon-purple/30 border-t-neon-orange flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-neon-orange" />
                                    </div>
                                </motion.div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Uploading Certificate</h3>
                            <p className="text-sm text-neon-gray">{file?.name}</p>
                            <div className="mt-6 w-full h-1 bg-neon-purple/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-neon-orange to-neon-purple"
                                    animate={{ width: ['0%', '100%'] }}
                                    transition={{ duration: 2, ease: 'easeInOut' }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Success Step */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-8 text-center"
                        >
                            <motion.div
                                animate={{ scale: [0.8, 1.1, 1] }}
                                transition={{ duration: 0.6 }}
                                className="flex justify-center mb-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                            </motion.div>

                            <h3 className="text-2xl font-bold text-white mb-2">Submission Successful!</h3>
                            <p className="text-sm text-neon-gray mb-6">Your certificate has been uploaded</p>

                            {/* Success Details */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 text-left space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-green-400 mt-1">✓</div>
                                    <div>
                                        <p className="text-xs text-neon-gray mb-1">Activity Type</p>
                                        <p className="text-sm font-semibold text-white">{activityType}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-green-400 mt-1">✓</div>
                                    <div>
                                        <p className="text-xs text-neon-gray mb-1">Criteria</p>
                                        <p className="text-sm font-semibold text-white">{criteria}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="text-yellow-400 mt-1">⏳</div>
                                    <div>
                                        <p className="text-xs text-neon-gray mb-1">Status</p>
                                        <p className="text-sm font-semibold text-yellow-300">Pending Review</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-neon-gray mb-4">
                                An administrator will review your submission within 24-48 hours
                            </p>

                            <button
                                onClick={handleClose}
                                className="w-full py-2 px-4 bg-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                            >
                                Done
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
