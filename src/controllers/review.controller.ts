import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * Create Review
 * Allows authenticated golfers to submit reviews for caddies
 */
export const createReview = async (req: Request, res: Response) => {
  // a. Check Authentication
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // b. Check Role
  const user = req.user as any;
  if (user.role !== 'GOLFER') {
    return res.status(403).json({ message: 'Forbidden: Only Golfers can submit reviews' });
  }

  // c. Get data from body
  const { rating, comment, caddyProfileId } = req.body;

  // d. Basic validation
  if (!rating || !caddyProfileId) {
    return res.status(400).json({ message: 'Rating and Caddy ID are required' });
  }

  try {
    // e. Create the new Review
    const newReview = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment,
        caddyProfileId,
        authorId: user.id, // Link to the logged-in Golfer
      },
    });
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });

  } catch (error) {
    res.status(500).json({ message: 'Server error submitting review' });
  }
};
