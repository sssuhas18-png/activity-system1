import axios from 'axios';

// Base API URL - For local development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5400';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (usn: string, name: string, email: string, password: string, role: string = 'student') => {
    const response = await api.post('/api/auth/register', { usn, name, email, password, role });
    return response.data;
  },
};

// Student APIs
export const studentAPI = {
  getProfile: async (usn: string) => {
    const response = await api.get(`/api/students/${usn}`);
    return response.data;
  },
  getSubmissions: async (usn: string) => {
    const response = await api.get(`/api/submissions/user/${usn}`);
    return response.data;
  },
  submitActivity: async (formData: FormData) => {
    const response = await api.post('/api/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getNotifications: async (usn: string) => {
    const response = await api.get(`/api/notifications/${usn}`);
    return response.data;
  },
};

// Points Rules API
export const pointsRulesAPI = {
  getAll: async () => {
    const response = await api.get('/api/pointsrules');
    return response.data;
  },
};

// Admin APIs
export const adminAPI = {
  getPendingSubmissions: async () => {
    const response = await api.get('/api/submissions/pending');
    return response.data;
  },
  verifySubmission: async (id: string, data: { status: string; remarks?: string }) => {
    const response = await api.put(`/api/submissions/verify/${id}`, data);
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },
  getAdmins: async () => {
    const response = await api.get('/api/admin/admins');
    return response.data;
  },
  getStudents: async (search?: string, proctorId?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (proctorId) params.append('proctorId', proctorId);
    
    const response = await api.get(`/api/admin/students?${params.toString()}`);
    return response.data;
  },
  getMyStudents: async () => {
    const response = await api.get('/api/admin/my-students');
    return response.data;
  },
  getGroupedStudents: async () => {
    const response = await api.get('/api/admin/grouped-students');
    return response.data;
  },
  assignStudent: async (studentId: string, proctorId: string) => {
    const response = await api.post('/api/admin/assign-student', { studentId, proctorId });
    return response.data;
  },
};

export default api;
