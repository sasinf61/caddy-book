'use client';

import { AuthProvider } from '../context/AuthContext';
import BottomNavBar from './BottomNavBar';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <AuthProvider>
      {/* Main content area with padding at the bottom */}
      <div className="pb-16 min-h-screen">
        {children}
      </div>

      {/* Global Navigation Bar */}
      <BottomNavBar />
    </AuthProvider>
  );
}
