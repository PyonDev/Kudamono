'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface UserSession {
  id: string;
  username: string;
  token: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedUser = localStorage.getItem('kudamono_session');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Authentication failed');
        return false;
      }

      const sessionData: UserSession = {
        id: data.id,
        username: data.username,
        token: data.token
      };

      setUser(sessionData);
      localStorage.setItem('kudamono_session', JSON.stringify(sessionData));
      setIsAuthModalOpen(false);
      return true;
    } catch (error) {
      alert('Cannot connect to backend server');
      return false;
    }
  };

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return false;
      }

      alert('Account created successfully! Please log in.');
      return true;
    } catch (error) {
      alert('Cannot connect to backend server');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kudamono_session');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isAuthModalOpen,
      setIsAuthModalOpen,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}