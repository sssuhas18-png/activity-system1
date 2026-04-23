"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ProgressCircle from "@/components/ProgressCircle"
import Flashcard from "@/components/Flashcard"
import SubFlashcard from "@/components/SubFlashcard"
import UploadModal from "@/components/UploadModal"
import SubmissionCard from "@/components/SubmissionCard"
import NotificationPanel from "@/components/NotificationPanel"
import PendingSubmissionCard from "@/components/PendingSubmissionCard"
import LeaderboardCard from "@/components/LeaderboardCard"
import { Bell, User, Shield, ChevronLeft, ChevronRight } from "lucide-react"

// Demo data to showcase UI
const demoPointsRules = [
  { activity_type: "NSS", criteria: "Blood Donation", points: 10 },
  { activity_type: "NSS", criteria: "Tree Plantation", points: 5 },
  { activity_type: "NSS", criteria: "Community Service", points: 8 },
  { activity_type: "SPORTS", criteria: "University Level", points: 15 },
  { activity_type: "SPORTS", criteria: "State Level", points: 20 },
  { activity_type: "SPORTS", criteria: "National Level", points: 30 },
  { activity_type: "TECH", criteria: "Hackathon Winner", points: 25 },
  { activity_type: "TECH", criteria: "Project Exhibition", points: 10 },
  { activity_type: "TECH", criteria: "Paper Publication", points: 20 },
  { activity_type: "CULTURAL", criteria: "Event Coordinator", points: 15 },
  { activity_type: "CULTURAL", criteria: "Performer", points: 10 },
  { activity_type: "CULTURAL", criteria: "Volunteer", points: 5 },
]

const demoSubmissions = [
  { id: 1, activity_type: "NSS", criteria: "Blood Donation", status: "approved", certificate_url: "/placeholder.svg" },
  { id: 2, activity_type: "TECH", criteria: "Hackathon Winner", status: "pending", certificate_url: "/placeholder.svg" },
  { id: 3, activity_type: "SPORTS", criteria: "State Level", status: "rejected", certificate_url: "/placeholder.svg" },
]

const demoNotifications = [
  { id: 1, message: "Your Blood Donation submission has been approved! +10 points", created_at: new Date().toISOString(), read: false },
  { id: 2, message: "New activity added: Paper Publication under TECH category", created_at: new Date(Date.now() - 86400000).toISOString(), read: false },
  { id: 3, message: "Your State Level Sports submission was rejected. Please resubmit with valid certificate.", created_at: new Date(Date.now() - 172800000).toISOString(), read: true },
]

const demoPendingSubmissions = [
  { id: 1, usn: "1RV21CS001", activity_type: "NSS", criteria: "Tree Plantation", certificate_url: "/placeholder.svg", created_at: new Date().toISOString() },
  { id: 2, usn: "1RV21CS042", activity_type: "TECH", criteria: "Hackathon Winner", certificate_url: "/placeholder.svg", created_at: new Date().toISOString() },
  { id: 3, usn: "1RV21CS078", activity_type: "CULTURAL", criteria: "Event Coordinator", certificate_url: "/placeholder.svg", created_at: new Date().toISOString() },
]

const demoLeaderboard = [
  { usn: "1RV21CS023", name: "Arjun Sharma", total_points: 85 },
  { usn: "1RV21CS045", name: "Priya Patel", total_points: 78 },
  { usn: "1RV21CS012", name: "Rahul Kumar", total_points: 72 },
  { usn: "1RV21CS067", name: "Sneha Reddy", total_points: 65 },
  { usn: "1RV21CS089", name: "Vikram Singh", total_points: 58 },
]

export default function DemoPage() {
  const [currentView, setCurrentView] = useState<"login" | "student" | "admin">("login")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState({ type: "", criteria: "", points: 0 })
  const [showNotifications, setShowNotifications] = useState(false)

  // Group activities by type
  const groupedActivities = demoPointsRules.reduce((acc, rule) => {
    if (!acc[rule.activity_type]) {
      acc[rule.activity_type] = []
    }
    acc[rule.activity_type].push({ criteria: rule.criteria, points: rule.points })
    return acc
  }, {} as Record<string, { criteria: string; points: number }[]>)

  const handleCriteriaClick = (type: string, criteria: string, points: number) => {
    setSelectedActivity({ type, criteria, points })
    setShowUploadModal(true)
  }

  const renderViewSelector = () => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("login")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentView === "login"
            ? "bg-white/20 text-white border border-white/30"
            : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
        }`}
      >
        Login Page
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("student")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentView === "student"
            ? "bg-green-500/30 text-green-400 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            : "bg-white/5 text-white/60 border border-white/10 hover:bg-green-500/10"
        }`}
      >
        Student Dashboard
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setCurrentView("admin")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          currentView === "admin"
            ? "bg-orange-500/30 text-orange-400 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
            : "bg-white/5 text-white/60 border border-white/10 hover:bg-orange-500/10"
        }`}
      >
        Admin Dashboard
      </motion.button>
    </div>
  )

  const renderLoginPage = () => (
    <div className="min-h-screen flex">
      {/* Student Login - Left Side */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/2 flex items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Student Login</h2>
                <p className="text-white/50 text-sm">Access your dashboard</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,197,94,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView("student")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
              >
                Login as Student
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* Admin Login - Right Side */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/2 flex items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-orange-500/10 to-transparent" />
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 rounded-2xl border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.15)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                <p className="text-white/50 text-sm">Manage submissions</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="admin@university.edu"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentView("admin")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
              >
                Login as Admin
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )

  const renderStudentDashboard = () => (
    <div className="min-h-screen pt-20 pb-8 px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, <span className="text-green-400">Student</span></h1>
          <p className="text-white/50">USN: 1RV21CS001</p>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(true)}
            className="relative p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
              2
            </span>
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Points Tracker */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Points Tracker</h2>
          <ProgressCircle current={65} target={100} />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">65</p>
              <p className="text-white/50 text-sm">Earned</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl font-bold text-white/70">35</p>
              <p className="text-white/50 text-sm">Remaining</p>
            </div>
          </div>
        </motion.div>

        {/* Activity Flashcards */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Activities</h2>
            {selectedCategory && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Categories
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
{Object.keys(groupedActivities).map((category, index) => (
                                  <Flashcard
                                    key={category}
                                    title={category}
                                    criteriaCount={groupedActivities[category].length}
                                    onClick={() => setSelectedCategory(category)}
                                    index={index}
                                  />
                                ))}
              </motion.div>
            ) : (
              <motion.div
                key="subcategories"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
{groupedActivities[selectedCategory].map((item, index) => (
                                  <SubFlashcard
                                    key={item.criteria}
                                    criteria={item.criteria}
                                    points={item.points}
                                    onClick={() => handleCriteriaClick(selectedCategory, item.criteria, item.points)}
                                    index={index}
                                  />
                                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* My Submissions */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 glass-card p-6 rounded-2xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]"
        >
          <h2 className="text-xl font-semibold text-white mb-6">My Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{demoSubmissions.map((submission, index) => (
                              <SubmissionCard
                                key={submission.id}
                                activityType={submission.activity_type}
                                criteria={submission.criteria}
                                status={submission.status as "pending" | "approved" | "rejected"}
                                imageUrl={submission.certificate_url}
                                index={index}
                              />
                            ))}
          </div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        activityType={selectedActivity.type}
        criteria={selectedActivity.criteria}
        points={selectedActivity.points}
        onSubmit={async () => {
          setShowUploadModal(false)
        }}
        isDemo={true}
      />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={demoNotifications.map(n => ({ id: String(n.id), message: n.message, type: "info" as const, createdAt: n.created_at }))}
        isLoading={false}
      />
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="min-h-screen pt-20 pb-8 px-4 md:px-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Admin <span className="text-orange-400">Dashboard</span></h1>
          <p className="text-white/50">Manage student submissions</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Submissions */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Pending Submissions</h2>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium">
              {demoPendingSubmissions.length} Pending
            </span>
          </div>
          <div className="space-y-4">
            {demoPendingSubmissions.map((submission, index) => (
              <PendingSubmissionCard
                key={submission.id}
                submission={submission}
                onApprove={async () => {}}
                onReject={async () => {}}
                delay={index * 0.1}
                isDemo={true}
              />
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl border border-orange-500/30 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Leaderboard</h2>
          <div className="space-y-3">
{demoLeaderboard.map((student, index) => (
                              <LeaderboardCard
                                key={student.usn}
                                rank={index + 1}
                                name={student.name}
                                usn={student.usn}
                                totalPoints={student.total_points}
                                index={index}
                              />
                            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {renderViewSelector()}
      
      <AnimatePresence mode="wait">
        {currentView === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderLoginPage()}
          </motion.div>
        )}
        {currentView === "student" && (
          <motion.div
            key="student"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderStudentDashboard()}
          </motion.div>
        )}
        {currentView === "admin" && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderAdminDashboard()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
