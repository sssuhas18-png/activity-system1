'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Shield, FileCheck, Trophy, Loader2, RefreshCw, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import useSWR from 'swr';

import PendingSubmissionCard from '@/components/PendingSubmissionCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import StudentsTable from '@/components/StudentsTable';

import { adminAPI } from '@/services/api';
import { getUser, logout, isAuthenticated, hasRole } from '@/utils/auth';
import { Users, UserCircle } from 'lucide-react';

interface PendingSubmission {
  _id: string;
  usn: string;
  student_name?: string;
  activity_type: { _id: string, name: string } | string;
  criteria: { _id: string, title: string, points: number } | string;
  proof_url?: string;
  createdAt?: string;
}

interface LeaderboardEntry {
  name: string;
  usn: string;
  total_points: number;
}

type TabType = 'pending' | 'leaderboard' | 'all-students' | 'my-students';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('pending');

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }
    if (!hasRole('admin')) {
      toast.error('Access denied');
      router.push('/');
      return;
    }
    const currentUser = getUser();
    setUser(currentUser);
  }, [router]);

  // Fetch pending submissions
  const {
    data: pendingSubmissions = [],
    mutate: mutatePending,
    isLoading: pendingLoading,
  } = useSWR<PendingSubmission[]>('pending-submissions', () => adminAPI.getPendingSubmissions(), {
    revalidateOnFocus: false,
  });

  // Fetch leaderboard
  const {
    data: leaderboard = [],
    mutate: mutateLeaderboard,
    isLoading: leaderboardLoading,
  } = useSWR<LeaderboardEntry[]>('leaderboard', () => adminAPI.getLeaderboard(), {
    revalidateOnFocus: false,
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleVerified = async () => {
    await mutatePending();
    await mutateLeaderboard();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-futuristic">
        <Loader2 className="w-8 h-8 text-neon-orange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-futuristic">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-orange/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-neon-orange/20">
                <Shield className="w-5 h-5 text-neon-orange" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Welcome, <span className="text-neon-orange">{user.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <section className="mb-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card neon-glow-orange p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neon-orange/20">
                  <FileCheck className="w-6 h-6 text-neon-orange" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-3xl font-bold text-neon-orange">{pendingSubmissions.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card neon-glow-purple p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neon-purple/20">
                  <Trophy className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Student</p>
                  <p className="text-xl font-bold text-neon-purple truncate">
                    {leaderboard[0]?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card neon-glow-green p-6 sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-neon-green/20">
                  <LayoutDashboard className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-neon-green">{leaderboard.length}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="mb-6">
          <div className="flex items-center gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                activeTab === 'pending'
                  ? 'border-neon-orange text-neon-orange'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Pending Submissions
              {pendingSubmissions.length > 0 && (
                <span className="px-2 py-0.5 bg-neon-orange/20 text-neon-orange text-xs rounded-full">
                  {pendingSubmissions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                activeTab === 'leaderboard'
                  ? 'border-neon-purple text-neon-purple'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('all-students')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                activeTab === 'all-students'
                  ? 'border-neon-green text-neon-green'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              All Students
            </button>
            <button
              onClick={() => setActiveTab('my-students')}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                activeTab === 'my-students'
                  ? 'border-neon-orange text-neon-orange'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              My Students
            </button>
          </div>
        </section>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Pending Submissions</h2>
                <p className="text-sm text-muted-foreground">
                  Review and verify student activity submissions
                </p>
              </div>
              <button
                onClick={() => mutatePending()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Refresh</span>
              </button>
            </div>

            {pendingLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-neon-orange animate-spin" />
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <div className="p-4 rounded-full bg-secondary inline-block mb-4">
                  <FileCheck className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No pending submissions to review at the moment
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((submission, index) => (
                  <PendingSubmissionCard
                    key={submission._id}
                    submission={{
                      id: submission._id,
                      usn: submission.usn,
                      activity_type: typeof submission.activity_type === 'string' ? submission.activity_type : submission.activity_type?.name,
                      criteria: typeof submission.criteria === 'string' ? submission.criteria : submission.criteria?.title,
                      certificate_url: submission.proof_url,
                      created_at: submission.createdAt,
                    }}
                    delay={index * 0.1}
                    onApprove={handleVerified}
                    onReject={handleVerified}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'leaderboard' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
                <p className="text-sm text-muted-foreground">
                  Top performing students by activity points
                </p>
              </div>
              <button
                onClick={() => mutateLeaderboard()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Refresh</span>
              </button>
            </div>

            {leaderboardLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
              </div>
            ) : leaderboard.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <div className="p-4 rounded-full bg-secondary inline-block mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">No data yet</h3>
                <p className="text-sm text-muted-foreground">
                  The leaderboard will populate once students earn points
                </p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {leaderboard.map((entry, index) => (
                  <LeaderboardCard
                    key={entry.usn}
                    rank={index + 1}
                    name={entry.name}
                    usn={entry.usn}
                    totalPoints={entry.total_points}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'all-students' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">All Students Directory</h2>
                <p className="text-sm text-muted-foreground">
                  View and assign proctors to registered students
                </p>
              </div>
            </div>
            <StudentsTable myStudentsOnly={false} />
          </section>
        )}

        {activeTab === 'my-students' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">My Assigned Students</h2>
                <p className="text-sm text-muted-foreground">
                  View students that are actively managed under your proctoring
                </p>
              </div>
            </div>
            <StudentsTable myStudentsOnly={true} />
          </section>
        )}
      </main>
    </div>
  );
}
