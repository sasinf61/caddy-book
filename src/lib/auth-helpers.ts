import { cookies } from 'next/headers';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'CADDY' | 'GOLFER';
  handicap?: number | null;
  playingStyle?: string | null;
}

interface CaddyProfile {
  id: string;
  userId: string;
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
  homeCourses: string | null;
  experienceYears: number | null;
  languages: string | null;
  specialties: string | null;
  certifications: string | null;
}

interface FavoriteCaddy {
  id: string;
  userId: string;
  caddyProfileId: string;
  createdAt: Date;
}

type UserWithProfile = User & {
  caddyProfile: CaddyProfile | null;
  favoriteCaddies: FavoriteCaddy[];
};

/**
 * Get the current authenticated user from Server Components
 * @returns The current user with profile and favorites, or null if not authenticated
 */
export const getCurrentUser = async (): Promise<UserWithProfile | null> => {
  try {
    // a. Get the session cookie using 'next/headers'
    const sessionCookie = (await cookies()).get('connect.sid')?.value;
    if (!sessionCookie) {
      return null; // Not logged in
    }

    // b. Fetch from our *internal* Express API, forwarding the cookie
    const response = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        Cookie: `connect.sid=${sessionCookie}`
      }
    });

    // c. Check response
    if (response.status === 401) {
      return null; // Session invalid or expired
    }
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    // d. Return the user data
    const user: UserWithProfile = await response.json();
    return user;

  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
