import Link from 'next/link';
import { UserCheck, Trophy } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">เข้าร่วมกับเรา</h1>
      
      {/* Subtitle */}
      <p className="text-lg text-gray-600 mb-8">คุณต้องการสมัครสมาชิกในฐานะ...</p>

      {/* Role Selection Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-8">
        {/* Box 1: I'm a Caddy */}
        <Link 
          href="/register/caddy-signup"
          className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg border-2 border-transparent transition-all duration-300 hover:border-green-500 hover:shadow-2xl"
        >
          <Trophy className="w-16 h-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">ฉันคือแคดดี้</h2>
          <p className="text-gray-500 text-center">
            สมัครเพื่อรับงาน, จัดการตารางเวลา, และแสดงโปรไฟล์ของคุณ
          </p>
        </Link>

        {/* Box 2: I'm a Golfer */}
        <Link 
          href="/register/golfer-signup"
          className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg border-2 border-transparent transition-all duration-300 hover:border-blue-500 hover:shadow-2xl"
        >
          <UserCheck className="w-16 h-16 text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">ฉันคือนักกอล์ฟ</h2>
          <p className="text-gray-500 text-center">
            สมัครเพื่อค้นหา, จองแคดดี้, และจัดการรอบการเล่นของคุณ
          </p>
        </Link>
      </div>

      {/* "Or" separator */}
      <div className="text-gray-400 mb-8">หรือ</div>

      {/* Google Social Login Button */}
      <a
        href="http://localhost:3001/api/auth/google"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {/* Google Icon SVG */}
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
        <span>สมัครสมาชิกด้วย Google</span>
      </a>
    </main>
  );
}
