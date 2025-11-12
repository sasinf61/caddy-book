'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CaddyGridItem from '../../components/CaddyGridItem';

// Define types based on our Prisma schema
type FavoriteCaddy = {
  id: string;
  userId: string;
  caddyProfileId: string;
  createdAt: Date;
};
type CaddyProfile = {
  id: string;
  slug: string;
  tier: 'A' | 'B' | 'C';
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
  age: number | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  description: string | null;
  profileImageUrl: string | null;
  profileViews: number;
  caddyIdNumber: string | null;
  isVerified: boolean;
  totalRounds: number;
  homeCourses: string[];
  experienceYears: number | null;
  languages: string[];
  specialties: string[];
  certifications: string[];
  userId: string;
};

type User = {
  id: string;
  username: string;
  phone: string | null;
  email: string;
  password: string | null;
  googleId: string | null;
  facebookId: string | null;
  role: 'GOLFER' | 'CADDY';
  handicap: number | null;
  playingStyle: string | null;
  isEmailVerified: boolean;
  verificationToken: string | null;
};

// Define the complex User type (User + optional CaddyProfile + FavoriteCaddies)
type UserWithProfile = User & {
  caddyProfile: CaddyProfile | null;
  favoriteCaddies: (FavoriteCaddy & { caddyProfile: (CaddyProfile & { user: User }) })[];
};

// Component: CaddyProfileView (UI for Caddy)
function CaddyProfileView({ user, profile }: { user: UserWithProfile; profile: CaddyProfile }) {
  // (This is based on the user's detailed UI blueprint)
  return (
    <div className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-2">โปรไฟล์แคดดี้</h1>
      <p className="text-xl text-gray-300 mb-4">{user.username}</p>
      
      {/* At-a-Glance Section */}
      <div className="border-b border-white/20 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white">ข้อมูลหลัก</h2>
        <p className="text-gray-300">รหัสแคดดี้: {profile.caddyIdNumber || 'N/A'}</p>
        <p className="text-gray-300">ยืนยันตัวตน: {profile.isVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}</p>
        <p className="text-gray-300">จำนวนรอบ: {profile.totalRounds}</p>
      </div>

      {/* About Section */}
      <div className="border-b border-white/20 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white">เกี่ยวกับ</h2>
        <p className="text-gray-300">อายุ: {profile.age || 'N/A'} ปี</p>
        <p className="text-gray-300">ภาษา: {profile.languages.join(', ') || 'N/A'}</p>
        <p className="text-gray-300">ประสบการณ์: {profile.experienceYears || '0'} ปี</p>
        <p className="text-gray-300">ทักษะพิเศษ: {profile.specialties.join(', ') || 'N/A'}</p>
      </div>
      
      {/* (We will add Edit button, Calendar, and Reviews later) */}
    </div>
  );
}

// Component: GolferProfileView (UI for Golfer)
function GolferProfileView({ user }: { user: UserWithProfile }) {
  // (This is based on the user's detailed UI blueprint)
  return (
    <div className="w-full max-w-2xl p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/10">
      <h1 className="text-3xl font-bold text-white mb-2">โปรไฟล์นักกอล์ฟ</h1>
      <p className="text-xl text-gray-300 mb-4">{user.username}</p>
      
      {/* Golfer Profile Section */}
      <div className="border-b border-white/20 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white">ข้อมูลนักกอล์ฟ</h2>
        <p className="text-gray-300">แฮนดิแคป (Hcp): {user.handicap || 'N/A'}</p>
        <p className="text-gray-300">สไตล์การเล่น: {user.playingStyle || 'N/A'}</p>
      </div>
      
      {/* Activity Management (Placeholder) */}
      <div className="border-b border-white/20 pb-4 mb-4">
        <h2 className="text-lg font-semibold text-white">การจองที่กำลังจะมาถึง</h2>
        <p className="text-gray-400">(ยังไม่มีการจอง...)</p>
      </div>

      {/* Favorite Caddies Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-white mb-4">แคดดี้คนโปรด</h2>
        {user.favoriteCaddies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {user.favoriteCaddies.map((fav) => (
              <CaddyGridItem key={fav.id} caddy={fav.caddyProfile} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">คุณยังไม่มีแคดดี้คนโปรด...</p>
        )}
      </div>

      {/* (We will add History later) */}
    </div>
  );
}

// Main Page Component
export default function ProfilePage() {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 1. useEffect: Fetch current user (this logic is the same)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          credentials: 'include' // Include cookies for authentication
        });
        if (response.status === 401) {
          router.push('/login'); // We need to create /login later
          return;
        }
        if (response.ok) {
          const data: UserWithProfile = await response.json();
          setUser(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // 2. handleLogout Function (this logic is the same)
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // Include cookies for logout
      });
      router.push('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // 3. Render Logic
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  // 4. Role-Based Render Logic
  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Check the user role and render the correct component */}
        {user.role === 'CADDY' && user.caddyProfile ? (
          <CaddyProfileView user={user} profile={user.caddyProfile} />
        ) : (
          <GolferProfileView user={user} />
        )}
        
        {/* Edit Profile Button */}
        <Link
          href="/profile/edit"
          className="block w-full text-center py-3 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 mb-4"
        >
          แก้ไขโปรไฟล์
        </Link>

        {/* Logout Button (shared by both) */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-3 px-4 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}


