'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'CADDY' | 'GOLFER';
  favoriteCaddies: FavoriteCaddy[];
}

interface FavoriteCaddy {
  id: string;
  userId: string;
  caddyProfileId: string;
  createdAt: Date;
}

interface FavoriteButtonProps {
  caddyProfileId: string;
  currentUser: (User & { favoriteCaddies: FavoriteCaddy[] }) | null;
}

export default function FavoriteButton({ caddyProfileId, currentUser }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Set initial state based on currentUser's favorites
  useEffect(() => {
    if (currentUser) {
      const hasFavorited = currentUser.favoriteCaddies?.some(
        (fav) => fav.caddyProfileId === caddyProfileId
      );
      setIsFavorite(!!hasFavorited);
    }
  }, [currentUser, caddyProfileId]);

  // Handle toggle favorite
  const handleToggleFavorite = async () => {
    // Redirect to login if not logged in
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setIsLoading(true);

    // Optimistic Update: Toggle UI immediately
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch('http://localhost:3001/api/favorites/toggle', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caddyProfileId }),
      });

      // Revert on error
      if (!response.ok) {
        setIsFavorite(!isFavorite);
      }

      // Refresh server state
      router.refresh();
    } catch (error) {
      // Revert on error
      setIsFavorite(!isFavorite);
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="p-2 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}
        size={24}
      />
    </button>
  );
}
