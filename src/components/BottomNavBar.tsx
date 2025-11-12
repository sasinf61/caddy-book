'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Flag, CalendarDays, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNavBar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();

  // Handle loading state
  if (isLoading) {
    return null;
  }

  // Define the Nav items (Array)
  const navItems = [
    { href: '/', icon: LayoutGrid, label: 'หน้าแรก' },
    { href: '/caddies', icon: Flag, label: 'แคดดี้' },
    { href: '/bookings', icon: CalendarDays, label: 'การจอง' },
  ];

  // Smart Profile Link
  const profileHref = user ? '/profile' : '/login';

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-black/30 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16">
        {/* Loop through nav items */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? 'text-white font-semibold' : 'text-gray-400'
              } hover:text-white`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Smart Profile/Login Button */}
        {(() => {
          const isProfileActive = pathname.startsWith('/profile') || pathname.startsWith('/login');
          
          return (
            <Link
              href={profileHref}
              className={`flex flex-col items-center p-2 transition-colors ${
                isProfileActive ? 'text-white font-semibold' : 'text-gray-400'
              } hover:text-white`}
            >
              <User size={24} />
              <span className="text-xs mt-1">{user ? 'โปรไฟล์' : 'ล็อกอิน'}</span>
            </Link>
          );
        })()}
      </div>
    </nav>
  );
}
