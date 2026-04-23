'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  isLoading: boolean;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-neon-green',
    bg: 'bg-neon-green/10',
  },
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  info: {
    icon: Info,
    color: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
  },
};

export default function NotificationPanel({ isOpen, onClose, notifications, isLoading }: NotificationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm glass-card rounded-l-2xl neon-glow-purple"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-purple/20">
                  <Bell className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Notifications</h2>
                  <p className="text-xs text-muted-foreground">
                    {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100%-88px)] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="p-4 rounded-full bg-secondary mb-3">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification, index) => {
                    const config = typeConfig[notification.type] || typeConfig.info;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notification.id || (notification as any)._id || `notification-${index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg ${config.bg} border border-border/50`}
                      >
                        <div className="flex gap-3">
                          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
