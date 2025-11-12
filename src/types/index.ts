// Shared types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  password: string | null;
  googleId: string | null;
  facebookId: string | null;
  role: 'GOLFER' | 'CADDY';
  handicap: number | null;
  playingStyle: string | null;
}

export interface CaddyProfile {
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
  homeCourses: string[];
  experienceYears: number | null;
  languages: string[];
  specialties: string[];
  certifications: string[];
}

export interface FavoriteCaddy {
  id: string;
  userId: string;
  caddyProfileId: string;
  createdAt: Date;
}

export type UserWithProfile = User & {
  caddyProfile: CaddyProfile | null;
  favoriteCaddies: (FavoriteCaddy & { caddyProfile: (CaddyProfile & { user: User }) })[];
};
