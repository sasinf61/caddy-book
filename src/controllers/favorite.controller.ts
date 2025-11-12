import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * Toggle Favorite
 * Allows authenticated golfers to add or remove caddies from their favorites
 */
export const toggleFavorite = async (req: Request, res: Response) => {
  // a. Check Authentication
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // b. Check Role
  const user = req.user as any;
  if (user.role !== 'GOLFER') {
    return res.status(403).json({ message: 'Forbidden: Only Golfers can favorite caddies' });
  }

  // c. Get data from body
  const { caddyProfileId } = req.body;
  if (!caddyProfileId) {
    return res.status(400).json({ message: 'Caddy ID is required' });
  }

  try {
    // d. Check if the favorite already exists (using the compound unique ID)
    const compositeId = { userId: user.id, caddyProfileId };
    const existingFavorite = await prisma.favoriteCaddy.findUnique({
      where: { userId_caddyProfileId: compositeId }
    });

    // e. Toggle Logic
    if (existingFavorite) {
      // It exists, so remove it (un-favorite)
      await prisma.favoriteCaddy.delete({ where: { id: existingFavorite.id } });
      return res.status(200).json({ message: 'Removed from favorites', status: 'removed' });
    } else {
      // It does not exist, so add it (favorite)
      await prisma.favoriteCaddy.create({
        data: {
          userId: user.id,
          caddyProfileId: caddyProfileId,
        }
      });
      return res.status(201).json({ message: 'Added to favorites', status: 'added' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error toggling favorite' });
  }
};
