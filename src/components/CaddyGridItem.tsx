import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CaddyProfile, User } from '../../generated/prisma/client.js';

interface CaddyGridItemProps {
  caddy: CaddyProfile & { user: User };
}

const CaddyGridItem: React.FC<CaddyGridItemProps> = ({ caddy }) => {
  return (
    <Link href={`/caddies/${caddy.slug}`} className="group block">
      {/* Image Container */}
      <div className="overflow-hidden rounded-lg">
        <Image
          src={caddy.profileImageUrl || `https://picsum.photos/seed/${caddy.userId}/400/500`}
          alt={caddy.user.username || 'Caddy Profile'}
          width={400}
          height={500}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content Area */}
      <div className="pt-2">
        {/* Caddy Name */}
        <h3 className="font-semibold text-sm text-white">
          {caddy.user.username}
        </h3>

        {/* Caddy Age */}
        <p className="text-sm text-gray-300">
          {caddy.age || 'N/A'} ปี
        </p>
      </div>
    </Link>
  );
};

export default CaddyGridItem;
