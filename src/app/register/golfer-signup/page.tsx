'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GolferSignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:3001/api/auth/register/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          role: 'GOLFER',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Success! Please check your email to verify your account.");
        // (Do NOT redirect. User must check email.)
      } else if (response.status === 409) {
        setError(data.message || 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้งานแล้ว');
      } else {
        setError('เกิดข้อผิดพลาดในการสมัคร');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-md"> {/* Container for both form and social login */}
        
        {/* Glassmorphism Form Card */}
        <form onSubmit={handleSubmit} className="form-card w-full p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-white">สมัคร (นักกอล์ฟ)</h1>
          
          {/* Input field: Username */}
          <div className="relative">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Username" />
          </div>

          {/* Input field: Email */}
          <div className="relative">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field w-full px-4 py-3 text-white bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" />
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50">
            {isLoading ? "Loading..." : "สมัครสมาชิก"}
          </button>

          {/* Success Message Display */}
          {message && <p className="text-center text-green-400">{message}</p>}

          {/* Error Display */}
          {error && <p className="text-center text-red-400">{error}</p>}

          {/* "Or" separator */}
          <div className="text-gray-400 my-6 text-center">หรือ</div>
          
          {/* Social Login Button (Google) */}
          <a
            href="http://localhost:3001/api/auth/start?role=GOLFER"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/90 border border-white/20 rounded-lg shadow-sm font-medium text-gray-800 hover:bg-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            สมัครสมาชิกด้วย Google
          </a>

          {/* "Login" Link */}
          <p className="text-sm text-center text-gray-300 pt-4">
            มีบัญชีอยู่แล้ว? <a href="/login" className="font-semibold text-blue-400 hover:text-blue-300">เข้าสู่ระบบ</a>
          </p>
        </form>

      </div>
    </main>
  );
}
