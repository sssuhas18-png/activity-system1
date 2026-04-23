'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/services/api';
import { toast } from 'sonner';
import { Search, Filter, Shield } from 'lucide-react';

interface Student {
  _id: string;
  usn: string;
  name: string;
  email: string;
  total_points: number;
  proctor?: {
    _id: string;
    usn: string;
    name: string;
  };
}

interface AdminProctor {
  _id: string;
  name: string;
  usn: string;
}

interface StudentsTableProps {
  myStudentsOnly?: boolean;
}

export default function StudentsTable({ myStudentsOnly = false }: StudentsTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [admins, setAdmins] = useState<AdminProctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedProctor, setSelectedProctor] = useState('');
  
  const fetchAdmins = async () => {
    try {
      const data = await adminAPI.getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to load admins', err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      if (myStudentsOnly) {
        const data = await adminAPI.getMyStudents();
        setStudents(data);
      } else {
        const data = await adminAPI.getStudents(search, selectedProctor);
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to load students', err);
      toast.error('Could not load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedProctor, myStudentsOnly]);

  const handleAssignProctor = async (studentId: string, proctorId: string) => {
    if (!proctorId) return;
    try {
      await adminAPI.assignStudent(studentId, proctorId);
      toast.success('Proctor assigned successfully!');
      fetchStudents(); // refresh
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to assign proctor');
    }
  };

  return (
    <div className="space-y-6">
      
      {!myStudentsOnly && (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by Name, USN, or Email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-neon-orange"
            />
          </div>
          
          <div className="relative w-full md:w-1/4">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <select 
              value={selectedProctor}
              onChange={(e) => setSelectedProctor(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-neon-orange appearance-none"
            >
              <option value="">All Proctors</option>
              <option value="unassigned">Unassigned Only</option>
              {admins.map(admin => (
                <option key={admin._id} value={admin._id}>{admin.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-neon-orange border-t-transparent rounded-full animate-spin"></div></div>
      ) : students.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl border border-gray-800">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Students Found</h3>
          <p className="text-gray-400">Try adjusting your filters or wait for students to register.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800/80 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 font-semibold">Student Identity</th>
                <th className="px-6 py-4 font-semibold">USN</th>
                <th className="px-6 py-4 font-semibold">Total Points</th>
                <th className="px-6 py-4 font-semibold">Assigned Proctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900/40">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{student.name}</span>
                      <span className="text-xs text-gray-500">{student.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-orange-400 font-medium">{student.usn}</td>
                  <td className="px-6 py-4 font-bold text-green-400">{student.total_points}</td>
                  <td className="px-6 py-4">
                    {/* Proctor Assignment Dropdown */}
                    <select
                      className={`w-full bg-gray-800 border ${student.proctor ? 'border-gray-700' : 'border-red-500/50 text-red-400'} text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-neon-orange`}
                      value={student.proctor?._id || ""}
                      onChange={(e) => handleAssignProctor(student._id, e.target.value)}
                    >
                      <option value="" disabled>-- Assign a Proctor --</option>
                      {admins.map(admin => (
                        <option key={admin._id} value={admin._id}>
                          {admin.name} ({admin.usn})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
