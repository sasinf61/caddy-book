'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { UserWithProfile } from '../types/index.js';

// Define the Context Type
interface AuthContextType {
  user: UserWithProfile | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          credentials: 'include',
        });

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (response.ok) {
          const data: UserWithProfile = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      // a. Call the backend API to destroy the session
      const response = await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // b. (THE FIX) Update the global state to 'null'
        setUser(null);
        // c. (NEW) Centralize the redirect
        router.push('/');
      } else {
        // Handle logout error (e.g., show a toast)
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  // Create the value object
  const value = { user, isLoading, logout };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Create the Custom Hook (for easy access)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
