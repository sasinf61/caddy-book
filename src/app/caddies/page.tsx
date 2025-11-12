import CaddyGridItem from '../../components/CaddyGridItem';
import { prisma } from '../../lib/prisma';

export default async function CaddiesPage() {
  // Fetch all caddy profiles with their related user data
  const caddies = await prisma.caddyProfile.findMany({
    include: {
      user: true, // Get the related User (for name)
    },
    orderBy: {
      profileViews: 'desc', // Order by most views
    }
  });

  // Separate the featured caddy (the one with the most views)
  const featuredCaddy = caddies[0]; // The first item (most views)
  const otherCaddies = caddies.slice(1); // Everyone else
  
  return (
    <main className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-white mb-6">แคดดี้ทั้งหมด</h1>
      
      {/* Responsive 2-Column Grid (Zara-style) */}
      <div className="grid grid-cols-2 gap-4 md:gap-6">

        {/* Featured Caddy (Spans 2 columns = BIG) */}
        {featuredCaddy && (
          <div className="col-span-2">
            <CaddyGridItem caddy={featuredCaddy} />
          </div>
        )}

        {/* Other Caddies (Fill the 2-column grid) */}
        {otherCaddies.map((caddy: typeof caddies[0]) => (
          <CaddyGridItem key={caddy.id} caddy={caddy} />
        ))}

      </div>
    </main>
  );
}
