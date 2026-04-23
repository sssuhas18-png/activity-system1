'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, isAuthenticated, logout as logoutUtil, User } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getUser();
        setUser(currentUser);
        
        // Role-based route protection
        if (pathname.startsWith('/student') && currentUser?.role !== 'student') {
          router.push('/');
        } else if (pathname.startsWith('/admin') && currentUser?.role !== 'admin') {
          router.push('/');
        }
      } else {
        setUser(null);
        if (pathname !== '/') {
          router.push('/');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const logout = () => {
    logoutUtil();
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
