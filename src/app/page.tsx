import { prisma } from '../lib/prisma';
import CaddyGridItem from '../components/CaddyGridItem';
import Link from 'next/link';
import { Search, MapPin, Zap, Flag } from 'lucide-react';

export default async function HomePage() {
  // Data Fetching Logic (Featured Caddies)
  const popularCaddies = await prisma.caddyProfile.findMany({
    where: {
      status: 'AVAILABLE' // Show only available caddies
    },
    include: {
      user: true // Needed for CaddyGridItem (name)
    },
    orderBy: {
      profileViews: 'desc' // Most popular first
    },
    take: 5 // Limit to 5
  });

  // Render Logic (Dark Mode Dashboard)
  return (
    <main className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">ค้นหาแคดดี้ของคุณ</h1>

      {/* Search Bar (Glassmorphism) */}
      <form className="relative mb-6">
        <input
          type="text"
          placeholder="ค้นหาแคดดี้, สนามกอล์ฟ..."
          className="input-field w-full px-4 py-4 pl-12 text-lg text-white bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
      </form>

      {/* Quick Actions (4 Boxes) */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Link href="/caddies" className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/20">
          <Flag className="w-6 h-6 text-white mb-1" />
          <span className="text-xs text-center text-white">แคดดี้ทั้งหมด</span>
        </Link>
        <Link href="/caddies/express" className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/20">
          <Zap className="w-6 h-6 text-white mb-1" />
          <span className="text-xs text-center text-white">แคดดี้ด่วน</span>
        </Link>
        <Link href="/golf-courses" className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/20">
          <Flag className="w-6 h-6 text-white mb-1" />
          <span className="text-xs text-center text-white">สนามกอล์ฟ</span>
        </Link>
        <Link href="/provinces" className="flex flex-col items-center p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-lg hover:bg-white/20">
          <MapPin className="w-6 h-6 text-white mb-1" />
          <span className="text-xs text-center text-white">จังหวัด</span>
        </Link>
      </div>

      {/* Featured Caddies (Horizontal Scroll) */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">แคดดี้ยอดนิยม (ว่าง)</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {popularCaddies.length > 0 ? (
            popularCaddies.map((caddy: typeof popularCaddies[0]) => (
              <div key={caddy.id} className="w-3/4 flex-shrink-0 md:w-1/3">
                <CaddyGridItem caddy={caddy} />
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              ขออภัย, ไม่มีแคดดี้ที่ว่างในขณะนี้
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
