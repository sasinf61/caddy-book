import { prisma } from '../../../lib/prisma';
import CaddyCard from '../../../components/CaddyCard';
import WriteReviewForm from '../../../components/WriteReviewForm';
import FavoriteButton from '../../../components/FavoriteButton';
import { getCurrentUser } from '../../../lib/auth-helpers';
import Link from 'next/link';

export default async function CaddyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params as required by Next.js 15
  const { slug } = await params;

  // Fetch the current user (for favorite button)
  const currentUser = await getCurrentUser();

  try {
    // Fetch the caddy profile with user and reviews by slug
    const caddy = await prisma.caddyProfile.findUniqueOrThrow({
      where: { slug },
      include: {
        user: true, // Need this for the name
        reviewsReceived: { // Need this for the review list
          orderBy: { createdAt: 'desc' },
          include: { author: true } // Need this for the reviewer's name
        }
      }
    });

    // Increment the profile view counter
    await prisma.caddyProfile.update({
      where: { slug },
      data: { profileViews: { increment: 1 } }
    });

    return (
      <main className="p-4 md:p-8 min-h-screen">
        {/* Back Button */}
        <Link 
          href="/caddies" 
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors mb-4 inline-block"
        >
          ← Back to All Caddies
        </Link>

        {/* Detailed Card */}
        <div className="max-w-2xl mx-auto my-6 relative">
          {/* Favorite Button (Absolute Positioned) */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton
              caddyProfileId={caddy.id}
              currentUser={currentUser}
            />
          </div>

          {/* The Caddy Card */}
          <CaddyCard caddy={caddy} />
        </div>

        {/* Reviews Section */}
        <div className="max-w-2xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4 text-white">รีวิว ({caddy.reviewsReceived.length})</h2>
          <div className="space-y-4">
            {caddy.reviewsReceived.map((review: any) => (
              <div key={review.id} className="p-4 bg-white/10 backdrop-blur-md rounded-lg shadow-lg border border-white/10">
                <p className="font-semibold text-white">{review.author.name}</p>
                <p className="text-sm text-gray-400">{review.createdAt.toLocaleDateString()}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    {/* Star Rating Display */}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={index < review.rating ? 'text-yellow-400' : 'text-gray-600'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">({review.rating}/5)</span>
                </div>
                {review.comment && <p className="mt-2 text-gray-300">{review.comment}</p>}
              </div>
            ))}
            {caddy.reviewsReceived.length === 0 && (
              <p className="text-gray-400 text-center py-8">ยังไม่มีรีวิว...</p>
            )}
          </div>

          {/* Write Review Form */}
          <div className="mt-8">
            <WriteReviewForm caddyProfileId={caddy.id} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-md rounded-lg shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">Caddy not found</h1>
          <p className="text-lg text-gray-300 mb-8">
            The caddy you're looking for doesn't exist.
          </p>
          <Link
            href="/caddies"
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to All Caddies
          </Link>
        </div>
      </main>
    );
  }
}
