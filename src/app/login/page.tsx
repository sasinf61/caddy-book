'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in cross-origin requests
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful! Redirect to profile.
        router.push('/profile');
      } else {
        // Handle errors (e.g., 401 Invalid credentials)
        setError(data.message || 'An error occurred.');
      }
    } catch (error) {
      setError('Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="form-card w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white">Login</h2>

        {/* Email Input */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
          />
        </div>

        {/* Error Display */}
        {error && <p className="text-center text-red-400">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

        {/* Forgot Password Link */}
        <a href="#" className="block text-sm text-center text-gray-300 hover:text-white">
          Forgot Password?
        </a>

        {/* Sign up Link */}
        <p className="text-sm text-center text-gray-300">
          No account?{' '}
          <a href="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
