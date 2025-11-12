import { PrismaClient } from '../../generated/prisma/client.js';
import type { CaddyProfile } from '../../generated/prisma/client.js';

class AvailabilityService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all caddies that are available during the entire requested time range.
   * 
   * @param startTime - Start of the requested booking period
   * @param endTime - End of the requested booking period
   * @returns Array of available CaddyProfile records
   */
  async getAvailableCaddies(startTime: Date, endTime: Date): Promise<CaddyProfile[]> {
    const availableCaddies = await this.prisma.caddyProfile.findMany({
      where: {
        status: 'AVAILABLE',
        bookings: {
          none: {
            AND: [
              {
                status: {
                  in: ['CONFIRMED', 'PENDING']
                }
              },
              {
                startTime: {
                  lt: endTime
                }
              },
              {
                endTime: {
                  gt: startTime
                }
              }
            ]
          }
        }
      }
    });

    return availableCaddies;
  }
}

export default AvailabilityService;
