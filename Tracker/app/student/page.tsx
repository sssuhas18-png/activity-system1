'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Bell, User, ChevronLeft, Loader2, RefreshCw, Upload, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';

import ProgressCircle from '@/components/ProgressCircle';
import Flashcard from '@/components/Flashcard';
import SubFlashcard from '@/components/SubFlashcard';
import ActivitySubmissionModal from '@/components/ActivitySubmissionModal';
import StudentSubmissionList from '@/components/StudentSubmissionList';
import NotificationPanel from '@/components/NotificationPanel';

import { studentAPI, pointsRulesAPI } from '@/services/api';
import { getUser, logout, isAuthenticated, hasRole } from '@/utils/auth';

interface PointRule {
  activity_type: string;
  criteria: string;
  points: number;
}

interface GroupedActivities {
  [key: string]: { criteria: string; points: number }[];
}

interface Submission {
  _id: string;
  activity_type: string;
  criteria: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_url?: string;
  points_awarded?: number;
  remarks?: string;
  createdAt?: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: string;
}

interface StudentProfile {
  name: string;
  usn: string;
  total_points: number;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; usn?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    activityType: string;
    criteria: string;
  }>({ isOpen: false, activityType: '', criteria: '' });

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    if (!hasRole('student')) {
      toast.error('Access denied');
      router.push('/');
      return;
    }
    const currentUser = getUser();
    setUser(currentUser);
  }, [router]);

  const usn = user?.usn || '';

  // Fetch student profile
  const { data: profile, mutate: mutateProfile, isLoading: profileLoading } = useSWR<StudentProfile>(
    usn ? `student-profile-${usn}` : null,
    () => studentAPI.getProfile(usn),
    { revalidateOnFocus: false }
  );

  // Fetch points rules
  const { data: pointsRules = [], isLoading: rulesLoading } = useSWR<PointRule[]>(
    'points-rules',
    () => pointsRulesAPI.getAll(),
    { revalidateOnFocus: false }
  );

  // Fetch submissions
  const { data: submissions = [], mutate: mutateSubmissions, isLoading: submissionsLoading } = useSWR<Submission[]>(
    usn ? `submissions-${usn}` : null,
    () => studentAPI.getSubmissions(usn),
    { revalidateOnFocus: false }
  );

  // Fetch notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useSWR<Notification[]>(
    usn ? `notifications-${usn}` : null,
    () => studentAPI.getNotifications(usn),
    { revalidateOnFocus: false }
  );

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Group activities by type
  const groupedActivities = useMemo<GroupedActivities>(() => {
    return pointsRules.reduce((acc: GroupedActivities, rule: PointRule) => {
      if (!acc[rule.activity_type]) {
        acc[rule.activity_type] = [];
      }
      acc[rule.activity_type].push({
        criteria: rule.criteria,
        points: rule.points,
      });
      return acc;
    }, {});
  }, [pointsRules]);

  const activityTypes = Object.keys(groupedActivities);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleActivityClick = (activityType: string, criteria: string) => {
    setUploadModal({ isOpen: true, activityType, criteria });
  };

  const handleSubmissionSuccess = () => {
    mutateSubmissions();
    mutateProfile();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-futuristic">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-futuristic">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-neon-green/20">
                <User className="w-5 h-5 text-neon-green" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">
                  Welcome, <span className="text-neon-green">{profile?.name || user.name}</span>
                </h1>
                <p className="text-xs text-muted-foreground">USN: {usn}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-purple text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Section 1: Profile & Points Overview */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-neon-green/30 p-8 rounded-2xl"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Student Name</p>
                      <h2 className="text-xl font-bold text-foreground">{profile?.name || user.name}</h2>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-neon-green/20">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">USN</p>
                      <p className="text-sm font-mono text-neon-green">{profile?.usn || usn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <p className="text-sm text-neon-cyan">{user?.name || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Progress */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground">Activity Points Progress</h3>

                  {profileLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-foreground">
                            {profile?.total_points || 0} / 100 Points
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(((profile?.total_points || 0) / 100) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(((profile?.total_points || 0) / 100) * 100, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                          />
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-neon-green/10 border border-neon-green/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Earned</p>
                          <p className="text-2xl font-bold text-neon-green">{profile?.total_points || 0}</p>
                        </div>
                        <div className="bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Target</p>
                          <p className="text-2xl font-bold text-neon-cyan">100</p>
                        </div>
                        <div className="bg-neon-purple/10 border border-neon-purple/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                          <p className="text-2xl font-bold text-neon-purple">
                            {Math.max(100 - (profile?.total_points || 0), 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section 2: Activity Flashcards */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Activities</h2>
              <p className="text-sm text-muted-foreground">Select a category to view available activities</p>
            </div>
            {selectedCategory && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </motion.button>
            )}
          </div>

          {rulesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Main Categories */}
              <AnimatePresence mode="wait">
                {!selectedCategory && (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  >
                    {activityTypes.map((type, index) => (
                      <Flashcard
                        key={type}
                        title={type}
                        criteriaCount={groupedActivities[type].length}
                        onClick={() => handleCategoryClick(type)}
                        isSelected={selectedCategory === type}
                        index={index}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Sub-categories (Criteria) */}
                {selectedCategory && groupedActivities[selectedCategory] && (
                  <motion.div
                    key="criteria"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="glass-card p-4 mb-4">
                      <h3 className="text-lg font-semibold text-neon-green">{selectedCategory}</h3>
                      <p className="text-sm text-muted-foreground">
                        {groupedActivities[selectedCategory].length} activities available
                      </p>
                    </div>
                    {groupedActivities[selectedCategory].map((activity, index) => {
                      const relatedSubmission = submissions.find(
                        s => s.activity_type === selectedCategory && s.criteria === activity.criteria && (s.status === 'approved' || s.status === 'pending')
                      );
                      const status = relatedSubmission ? relatedSubmission.status : undefined;

                      return (
                        <SubFlashcard
                          key={`${selectedCategory}-${activity.criteria}`}
                          criteria={activity.criteria}
                          points={activity.points}
                          onClick={() => handleActivityClick(selectedCategory, activity.criteria)}
                          index={index}
                          status={status}
                        />
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Section 3: Submission Summary */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {/* Pending Count */}
            <div className="glass-card border border-yellow-500/30 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Pending Review</h3>
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {submissions.filter(s => s.status === 'pending').length}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting admin verification</p>
            </div>

            {/* Approved Count */}
            <div className="glass-card border border-green-500/30 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Approved</h3>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-400">
                {submissions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                +{submissions.filter(s => s.status === 'approved').reduce((acc, s) => acc + (s.points_awarded || 0), 0)} points earned
              </p>
            </div>

            {/* Quick Upload */}
            <div className="glass-card border border-neon-purple/30 p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Ready to Upload?</h3>
                <p className="text-xs text-muted-foreground mb-4">Upload a new certificate for any activity</p>
              </div>
              <button
                onClick={() => setSelectedCategory(activityTypes[0] || null)}
                className="w-full px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-lg text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                New Upload
              </button>
            </div>
          </motion.div>
        </section>

        {/* Section 4: My Submissions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-neon-purple/30 p-8 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-1">My Submissions</h2>
                <p className="text-sm text-muted-foreground">Track the status of your submitted activities and certificates</p>
              </div>
              <button
                onClick={() => mutateSubmissions()}
                disabled={submissionsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 text-neon-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${submissionsLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium hidden sm:inline">Refresh</span>
              </button>
            </div>

            {submissionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 border border-dashed border-neon-purple/20 rounded-lg"
              >
                <div className="p-4 rounded-full bg-neon-purple/10 inline-block mb-4">
                  <Upload className="w-8 h-8 text-neon-purple" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No submissions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select an activity above and upload your certificate to get started
                </p>
              </motion.div>
            ) : (
              <StudentSubmissionList submissions={submissions} />
            )}
          </motion.div>
        </section>
      </main>

      <ActivitySubmissionModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false, activityType: '', criteria: '' })}
        activityType={uploadModal.activityType}
        criteria={uploadModal.criteria}
        onSuccess={handleSubmissionSuccess}
      />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        isLoading={notificationsLoading}
      />
    </div>
  );
}
