// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  usn?: string;
}

// Auth types
export interface LoginResponse {
  token: string;
  user: User;
}

// Student types
export interface StudentProfile {
  name: string;
  usn: string;
  email: string;
  total_points: number;
}

// Points Rule types
export interface PointRule {
  _id: string;
  activity_type: string;
  criteria: string;
  points: number;
}

export interface GroupedActivities {
  [key: string]: { criteria: string; points: number }[];
}

// Submission types
export interface Submission {
  _id: string;
  student_usn: string;
  student_name?: string;
  activity_type: string;
  criteria: string;
  status: 'pending' | 'approved' | 'rejected';
  certificate_url?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  createdAt: string;
  read: boolean;
}

// Leaderboard types
export interface LeaderboardEntry {
  name: string;
  usn: string;
  total_points: number;
}

// API Response types
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
