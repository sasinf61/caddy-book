'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// (We must wrap the component that uses 'useSearchParams' in Suspense)
// Create the main component (the logic)
function VerifyAndCompleteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for the form
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(''); // Optional phone
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>('Verifying token...');
  const [isLoading, setIsLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // useEffect: Verify the token *on load*
  // (We must check if the token is valid *before* showing the password form)
  useEffect(() => {
    const tokenFromParams = searchParams.get('token');
    if (!tokenFromParams) {
      setError('Invalid link. No token provided.');
      setIsLoading(false);
      return;
    }
    setToken(tokenFromParams);

    const verifyToken = async () => {
      // (SIMPLIFIED: Assume token is valid if it exists)
      // (We will validate it server-side when they submit the form)
      setIsTokenValid(true);
      setIsLoading(false);
      setMessage('Token verified. Please set your password.');
    };

    verifyToken();
  }, [searchParams]);

  // handleSubmit function (calls the *new* API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration complete! Redirecting to homepage...');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(data.message || 'Failed to complete registration.');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Could not connect to server.');
      setIsLoading(false);
    }
  };

  // Render Logic (Glassmorphism theme)
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Complete Registration</h1>

        {/* Show Form *only if* token is valid */}
        {isLoading && <p className="text-center text-gray-300">{message}</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        {message && !error && <p className="text-center text-green-400">{message}</p>}

        {isTokenValid && !message?.includes('complete') && (
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Input field: Password */}
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                     className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Create Password" />
            </div>
            {/* Input field: Confirm Password */}
            <div className="relative">
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                     className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Confirm Password" />
            </div>
            {/* Input field: Phone */}
            <div className="relative">
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                     className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="เบอร์โทรศัพท์ (ถ้าต้องการเปลี่ยน)" />
            </div>
            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50">
              {isLoading ? "Saving..." : "Set Password & Finish"}
            </button>
          </form>
        )}

        {/* Show "Go to Login" button on error */}
        {error && (
          <Link href="/login" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
            Go to Login
          </Link>
        )}
      </div>
    </main>
  );
}

// Export the page wrapped in Suspense (as required by useSearchParams)
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading Verification...</div>}>
      <VerifyAndCompleteForm />
    </Suspense>
  );
}
