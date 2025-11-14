import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding golf courses...');

  // ลบข้อมูลเก่าออกก่อน
  await prisma.golfCourse.deleteMany({});

  // สนามกอล์ฟใกล้กรุงเทพ (ใช้พิกัดจริง)
  const golfCourses = [
    {
      name: 'Alpine Golf Club',
      latitude: 13.8538,
      longitude: 100.6265,
      rating: 4.5,
      holes: 18,
      priceRange: '฿฿฿',
      imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
      description: 'สนามกอล์ฟชั้นนำที่มีวิวภูเขา พร้อมสิ่งอำนวยความสะดวกครบครัน',
    },
    {
      name: 'Muang Kaew Golf Course',
      latitude: 13.9622,
      longitude: 100.6984,
      rating: 4.2,
      holes: 27,
      priceRange: '฿฿',
      imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
      description: 'สนามกอล์ฟขนาดใหญ่ เหมาะสำหรับนักกอล์ฟทุกระดับ',
    },
    {
      name: 'Riverdale Golf Club',
      latitude: 13.7250,
      longitude: 100.6532,
      rating: 4.7,
      holes: 18,
      priceRange: '฿฿฿฿',
      imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
      description: 'สนามกอล์ฟริมแม่น้ำ บรรยากาศสวยงาม',
    },
    {
      name: 'Bangkok Golf Club',
      latitude: 13.7563,
      longitude: 100.5018,
      rating: 4.4,
      holes: 18,
      priceRange: '฿฿฿',
      imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
      description: 'สนามกอล์ฟใจกลางเมือง เดินทางสะดวก',
    },
    {
      name: 'Lakewood Country Club',
      latitude: 13.6927,
      longitude: 100.7509,
      rating: 4.6,
      holes: 18,
      priceRange: '฿฿฿',
      imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=800',
      description: 'สนามกอล์ฟริมทะเลสาบ ออกแบบโดยนักออกแบบชื่อดัง',
    },
  ];

  await prisma.golfCourse.createMany({
    data: golfCourses,
  });

  console.log(`✅ Created ${golfCourses.length} golf courses successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding golf courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
