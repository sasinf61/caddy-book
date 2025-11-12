'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'CADDY' | 'GOLFER';
  handicap?: number | null;
  playingStyle?: string | null;
  caddyProfile: CaddyProfile | null;
}

interface CaddyProfile {
  id: string;
  userId: string;
  caddyIdNumber?: string | null;
  homeCourses?: string | null;
  experienceYears?: number | null;
  languages?: string | null;
  specialties?: string | null;
  certifications?: string | null;
  description?: string | null;
}

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  // Fetch current user data to pre-fill the form
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('http://localhost:3001/api/auth/me', {
          credentials: 'include',
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setUser(data);

          // Pre-fill form data based on role
          if (data.role === 'CADDY') {
            setFormData(data.caddyProfile || {});
          } else {
            setFormData({
              handicap: data.handicap,
              playingStyle: data.playingStyle,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiPath = user?.role === 'CADDY' ? '/api/profile/caddy' : '/api/profile/golfer';
      const response = await fetch(`http://localhost:3001${apiPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // Render if no user
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {user.role === 'CADDY' ? (
              // Caddy Form Fields
              <>
                <div>
                  <label htmlFor="caddyIdNumber" className="block text-sm font-medium text-white/80 mb-2">
                    Caddy ID Number
                  </label>
                  <input
                    type="text"
                    id="caddyIdNumber"
                    name="caddyIdNumber"
                    value={formData.caddyIdNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your caddy ID"
                  />
                </div>

                <div>
                  <label htmlFor="homeCourses" className="block text-sm font-medium text-white/80 mb-2">
                    Home Courses
                  </label>
                  <input
                    type="text"
                    id="homeCourses"
                    name="homeCourses"
                    value={formData.homeCourses || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Pebble Beach, Augusta National"
                  />
                </div>

                <div>
                  <label htmlFor="experienceYears" className="block text-sm font-medium text-white/80 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-white/80 mb-2">
                    Languages
                  </label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={formData.languages || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., English, Spanish"
                  />
                </div>

                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-white/80 mb-2">
                    Specialties
                  </label>
                  <input
                    type="text"
                    id="specialties"
                    name="specialties"
                    value={formData.specialties || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Course management, Club selection"
                  />
                </div>

                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-white/80 mb-2">
                    Certifications
                  </label>
                  <input
                    type="text"
                    id="certifications"
                    name="certifications"
                    value={formData.certifications || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., PGA Certified, First Aid"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell golfers about yourself..."
                  />
                </div>
              </>
            ) : (
              // Golfer Form Fields
              <>
                <div>
                  <label htmlFor="handicap" className="block text-sm font-medium text-white/80 mb-2">
                    Handicap
                  </label>
                  <input
                    type="number"
                    id="handicap"
                    name="handicap"
                    value={formData.handicap || ''}
                    onChange={handleChange}
                    step="0.1"
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your handicap"
                  />
                </div>

                <div>
                  <label htmlFor="playingStyle" className="block text-sm font-medium text-white/80 mb-2">
                    Playing Style
                  </label>
                  <input
                    type="text"
                    id="playingStyle"
                    name="playingStyle"
                    value={formData.playingStyle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Aggressive, Conservative, Balanced"
                  />
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  user.role === 'CADDY'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex-1 py-3 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
