import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * Update Caddy Profile
 * Allows authenticated caddies to update their profile information
 */
export const updateCaddyProfile = async (req: Request, res: Response) => {
  // a. Check Authentication
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // b. Check Role
  const user = req.user as any;
  if (user.role !== 'CADDY') {
    return res.status(403).json({ message: 'Forbidden: Only Caddies can update Caddy profiles' });
  }

  // c. Get data from body (only fields Caddy can edit)
  const {
    caddyIdNumber,
    homeCourses,
    experienceYears,
    languages,
    specialties,
    certifications,
    description
  } = req.body;

  try {
    // d. Update the CaddyProfile linked to this User
    const updatedProfile = await prisma.caddyProfile.update({
      where: { userId: user.id }, // Update the profile linked to the logged-in user
      data: {
        caddyIdNumber,
        homeCourses,
        experienceYears,
        languages,
        specialties,
        certifications,
        description,
      },
    });
    res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });

  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * Update Golfer Profile
 * Allows authenticated golfers to update their profile information
 */
export const updateGolferProfile = async (req: Request, res: Response) => {
  // a. Check Authentication
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // b. Check Role
  const user = req.user as any;
  if (user.role !== 'GOLFER') {
    return res.status(403).json({ message: 'Forbidden: Only Golfers can update Golfer profiles' });
  }

  // c. Get data from body (only fields Golfer can edit)
  const { handicap, playingStyle } = req.body;

  try {
    // d. Update the *User* model (since Golfer fields are on the User model)
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // Update the profile of the logged-in user
      data: {
        handicap,
        playingStyle,
      },
    });

    // e. Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ message: 'Profile updated successfully', user: userWithoutPassword });

  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
