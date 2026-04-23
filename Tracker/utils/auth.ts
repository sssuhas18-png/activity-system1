export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  usn?: string;
}

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  usn?: string;
  exp: number;
  iat: number;
}

// Parse JWT token without external library
export function parseJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Store auth data
export function setAuth(token: string) {
  localStorage.setItem('token', token);
  const decoded = parseJwt(token);
  if (decoded) {
    const user: User = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      usn: decoded.usn,
    };
    localStorage.setItem('user', JSON.stringify(user));
  }
}

// Get stored user
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Get stored token
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  const decoded = parseJwt(token);
  if (!decoded) return false;
  
  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
}

// Logout
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Check user role
export function hasRole(role: 'student' | 'admin'): boolean {
  const user = getUser();
  return user?.role === role;
}
