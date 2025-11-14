import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// คำนวณระยะทางระหว่าง 2 จุด (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // รัศมีของโลกในกิโลเมตร
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/golf-courses - ดึงสนามกอล์ฟทั้งหมด
export const getAllGolfCourses = async (req: Request, res: Response) => {
  try {
    const golfCourses = await prisma.golfCourse.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ golfCourses });
  } catch (error) {
    console.error('Error fetching golf courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/golf-courses/nearby - ดึงสนามกอล์ฟใกล้เคียง
export const getNearbyCourses = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseInt(radius as string);

    // ดึงสนามกอล์ฟทั้งหมด
    const allCourses = await prisma.golfCourse.findMany();

    // คำนวณระยะทางและกรองเฉพาะที่อยู่ในรัศมีที่กำหนด
    const nearbyCourses = allCourses
      .map((course) => {
        const distance = calculateDistance(lat, lon, course.latitude, course.longitude);
        return { ...course, distance };
      })
      .filter((course) => course.distance <= rad)
      .sort((a, b) => a.distance - b.distance);

    res.json({ golfCourses: nearbyCourses });
  } catch (error) {
    console.error('Error fetching nearby golf courses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/golf-courses/:id - ดึงสนามกอล์ฟตาม ID
export const getGolfCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const golfCourse = await prisma.golfCourse.findUnique({
      where: { id: parseInt(id) },
    });

    if (!golfCourse) {
      return res.status(404).json({ message: 'Golf course not found' });
    }

    res.json({ golfCourse });
  } catch (error) {
    console.error('Error fetching golf course:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
