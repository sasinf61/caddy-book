import { Inter } from 'next/font/google';
import '../globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import BottomNavBar from '../components/BottomNavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caddy Booking',
  description: 'Book your golf caddy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-200`}>
        <AuthProvider>
          {/* Main content area with padding at the bottom */}
          <div className="pb-16">
            {children}
          </div>

          {/* Global Navigation Bar */}
          <BottomNavBar />
        </AuthProvider>
      </body>
    </html>
  );
}
