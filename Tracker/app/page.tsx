'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Shield, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';
import { setAuth } from '@/utils/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [studentForm, setStudentForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ usn: '', name: '', email: '', password: '', confirmPassword: '' });
  const [studentLoading, setStudentLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    try {
      const response = await authAPI.login(studentForm.email, studentForm.password);
      
      if (response.user.role !== 'student') {
        throw new Error('Please use the Admin Login portal.');
      }

      setAuth(response.token);
      toast.success('Welcome back, Student!');
      router.push('/student');
    } catch (error: unknown) {
      const err = error as Error | { response?: { data?: { message?: string } } };
      const errorMessage = err instanceof Error ? err.message : (err.response?.data?.message || 'Login failed');
      toast.error(errorMessage);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      const response = await authAPI.login(adminForm.email, adminForm.password);
      
      if (response.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      setAuth(response.token);
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } catch (error: unknown) {
      const err = error as Error | { response?: { data?: { message?: string } } };
      const errorMessage = err instanceof Error ? err.message : (err.response?.data?.message || 'Login failed');
      toast.error(errorMessage);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSignUpLoading(true);
    try {
      const response = await authAPI.register(signUpForm.usn, signUpForm.name, signUpForm.email, signUpForm.password, 'student');
      setAuth(response.token);
      toast.success('Sign up successful!');
      router.push('/student');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Sign up failed');
    } finally {
      setSignUpLoading(false);
    }
  };

  if (isSignUp) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[200px]" />
        </div>

        {/* Header for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden p-6 text-center relative z-10"
        >
          <h1 className="text-2xl font-bold text-white">Activity Points Tracker</h1>
          <p className="text-gray-400 text-sm mt-1">Enterprise Management System</p>
        </motion.div>

        {/* Sign Up Form - Center */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex items-center justify-center p-6 lg:p-12 relative"
        >
          <div className="w-full max-w-md">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gray-800/50 border border-gray-700/30 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Account</h2>
                  <p className="text-gray-400 text-sm">Join the platform</p>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-5">
                {/* USN Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">USN</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="1BY21CS001"
                      value={signUpForm.usn}
                      onChange={(e) => setSignUpForm({ ...signUpForm, usn: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
                      required
                    />
                  </div>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={signUpForm.name}
                      onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-gray-600/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showSignUpConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signUpLoading}
                  className="w-full py-3 mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {signUpLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="text-center text-gray-400 text-sm mt-6">
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  Login
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Branding - Right Side (Hidden on Mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative"
        >
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold text-white mb-4">Activity Points Tracker</h1>
            <p className="text-gray-400 text-lg mb-12">Enterprise Management System for tracking and rewarding activities</p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-blue-500/20 flex-shrink-0">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">Track Activities</h3>
                  <p className="text-gray-400 text-sm">Submit and track your activities in real-time</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-purple-500/20 flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">Earn Points</h3>
                  <p className="text-gray-400 text-sm">Gain points for completed activities</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-lg bg-indigo-500/20 flex-shrink-0">
                  <Lock className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white mb-1">Leaderboards</h3>
                  <p className="text-gray-400 text-sm">Compete and see where you stand</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-orange/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[200px]" />
      </div>

      {/* Header for Mobile */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden p-6 text-center relative z-10"
      >
        <h1 className="text-2xl font-bold neon-text-purple">Activity Points Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Enterprise Management System</p>
      </motion.div>

      {/* Student Login - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card neon-glow-green p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-neon-green/20">
                <User className="w-6 h-6 text-neon-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Student Login</h2>
                <p className="text-muted-foreground text-sm">Access your activity dashboard</p>
              </div>
            </div>

            <form onSubmit={handleStudentLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showStudentPassword ? 'text' : 'password'}
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowStudentPassword(!showStudentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showStudentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={studentLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-neon-green text-background font-semibold rounded-lg hover:bg-neon-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {studentLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Student'
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                Track your activities and earn points towards your goals
              </p>
              <button
                onClick={() => setIsSignUp(true)}
                className="w-full mt-4 text-neon-green hover:text-neon-green/80 font-semibold transition"
              >
                Create an account
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="hidden lg:flex items-center justify-center relative">
        <div className="w-px h-2/3 bg-gradient-to-b from-transparent via-border to-transparent" />
        <div className="absolute top-1/2 -translate-y-1/2 transform rotate-90 lg:rotate-0">
          <div className="glass-card px-4 py-2 rounded-full">
            <span className="text-xs font-medium text-muted-foreground">OR</span>
          </div>
        </div>
      </div>

      {/* Mobile Divider */}
      <div className="lg:hidden flex items-center justify-center py-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="glass-card px-4 py-2 rounded-full mx-4">
          <span className="text-xs font-medium text-muted-foreground">OR</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Admin Login - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-6 lg:p-12 relative"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card neon-glow-orange p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-neon-orange/20">
                <Shield className="w-6 h-6 text-neon-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
                <p className="text-muted-foreground text-sm">Manage submissions and users</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="admin@university.edu"
                    className="w-full pl-11 pr-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-orange/50 focus:border-neon-orange transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-orange/50 focus:border-neon-orange transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={adminLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-neon-orange text-background font-semibold rounded-lg hover:bg-neon-orange/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {adminLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In as Admin'
                )}
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                Review submissions and manage the leaderboard
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Demo Mode Banner
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <Link href="/demo">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 glass-card rounded-full border border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">View Demo Preview</span>
            <span className="text-purple-400 text-sm">(No backend needed)</span>
          </motion.div>
        </Link>
      </motion.div>
      */}
    </div>
  );
}
