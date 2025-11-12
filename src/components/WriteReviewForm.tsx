'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WriteReviewFormProps {
  caddyProfileId: string;
}

export default function WriteReviewForm({ caddyProfileId }: WriteReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: parseInt(rating.toString(), 10),
          comment,
          caddyProfileId,
        }),
      });

      if (response.ok) {
        // Reset form
        setRating(0);
        setComment('');
        // Refresh the page to show the new review
        router.refresh();
      } else if (response.status === 401 || response.status === 403) {
        setError('เฉพาะนักกอล์ฟที่ล็อกอินเท่านั้นที่สามารถรีวิวได้');
      } else {
        setError('เกิดข้อผิดพลาด');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/10">
      <h3 className="text-xl font-semibold mb-4 text-white">เขียนรีวิวของคุณ</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-400 text-red-400 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-300 mb-2">
            คะแนน (1-5 ดาว)
          </label>
          <input
            type="number"
            id="rating"
            min="1"
            max="5"
            value={rating || ''}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            required
            className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="ใส่คะแนน 1-5"
          />
        </div>

        {/* Comment Textarea */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
            ความคิดเห็น
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="แบ่งปันประสบการณ์ของคุณกับแคดดี้คนนี้..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || rating < 1 || rating > 5}
          className="w-full py-3 px-4 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
        >
          {isLoading ? 'กำลังส่ง...' : 'ส่งรีวิว'}
        </button>
      </form>
    </div>
  );
}
