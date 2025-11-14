import { Router } from 'express';
import { getAllGolfCourses, getNearbyCourses, getGolfCourseById } from '../controllers/golfCourseController';

const router = Router();

// GET /api/golf-courses - ดึงสนามกอล์ฟทั้งหมด
router.get('/', getAllGolfCourses);

// GET /api/golf-courses/nearby - ดึงสนามกอล์ฟใกล้เคียง
router.get('/nearby', getNearbyCourses);

// GET /api/golf-courses/:id - ดึงสนามกอล์ฟตาม ID
router.get('/:id', getGolfCourseById);

export default router;
