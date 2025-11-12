import React from 'react';
import Image from 'next/image';
import { Star, Circle, CalendarDays, PersonStanding, Info } from 'lucide-react';
import type { CaddyProfile, User } from '@prisma/client';

interface CaddyCardProps {
  caddy: CaddyProfile & { user: User };
}

const CaddyCard: React.FC<CaddyCardProps> = ({ caddy }) => {
  // Determine status color
  const statusIconColor = caddy.status === 'AVAILABLE'
    ? 'text-green-400 fill-green-400'
    : 'text-gray-400 fill-gray-400';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl border border-white/10">
      {/* Profile Picture */}
      <div className="relative w-full h-48">
        <Image
          src={caddy.profileImageUrl || `https://picsum.photos/seed/${caddy.userId}/400/400`}
          alt={caddy.user.username}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Caddy Name */}
        <h3 className="font-bold text-xl text-white mb-2">
          {caddy.user.username}
        </h3>

        {/* Age and Gender */}
        <div className="flex flex-row items-center gap-4 text-sm text-gray-300 mb-2">
          {/* Age */}
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{caddy.age || 'N/A'} ปี</span>
          </div>
          {/* Gender */}
          <div className="flex items-center gap-1">
            <PersonStanding className="h-4 w-4" />
            <span>{caddy.gender || 'N/A'}</span>
          </div>
        </div>

        {/* Caddy Tier and Status */}
        <div className="flex flex-row gap-4">
          {/* Caddy Tier Badge */}
          <div className="flex items-center gap-1 text-sm font-medium text-amber-400">
            <Star className="h-4 w-4" />
            <span>Tier {caddy.tier}</span>
          </div>

          {/* Caddy Status Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Circle className={`h-3 w-3 ${statusIconColor}`} />
            <span>{caddy.status}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-sm text-gray-300 italic">
            {caddy.description || 'ไม่มีคำอธิบายสั้นๆ'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaddyCard;

