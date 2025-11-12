import type { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client.js';
import AvailabilityService from '../services/AvailabilityService.js';

const prisma = new PrismaClient();
const availabilityService = new AvailabilityService();

/**
 * Create a new booking
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, caddyProfileId, startTime, endTime } = req.body;

    // Validate required fields
    if (!userId || !caddyProfileId || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Missing required fields: userId, caddyProfileId, startTime, endTime'
      });
    }

    // Convert strings to Date objects
    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);

    // Validate dates
    if (bookingStart >= bookingEnd) {
      return res.status(400).json({
        error: 'startTime must be before endTime'
      });
    }

    // Check if the caddy profile is available during the requested time
    const availableCaddies = await availabilityService.getAvailableCaddies(
      bookingStart,
      bookingEnd
    );

    const isAvailable = availableCaddies.some(
      (caddyProfile) => caddyProfile.id === caddyProfileId
    );

    if (!isAvailable) {
      return res.status(409).json({
        error: 'Caddy is not available during the requested time period'
      });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        caddyProfileId,
        startTime: bookingStart,
        endTime: bookingEnd,
        status: 'PENDING'
      },
      include: {
        user: true,
        caddyProfile: {
          include: {
            user: true
          }
        }
      }
    });

    return res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({
      error: 'Failed to create booking'
    });
  }
};

/**
 * Get all bookings
 */
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        caddyProfile: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });

    return res.status(200).json({
      bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({
      error: 'Failed to fetch bookings'
    });
  }
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Booking ID is required'
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        caddyProfile: {
          include: {
            user: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    return res.status(200).json({
      booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({
      error: 'Failed to fetch booking'
    });
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Booking ID is required'
      });
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED'
      });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        caddyProfile: {
          include: {
            user: true
          }
        }
      }
    });

    return res.status(200).json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({
      error: 'Failed to update booking'
    });
  }
};

/**
 * Delete a booking
 */
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        error: 'Booking ID is required'
      });
    }

    await prisma.booking.delete({
      where: { id }
    });

    return res.status(200).json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({
      error: 'Failed to delete booking'
    });
  }
};
