import Link from 'next/link';

export default function GolfCoursesPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">สนามกอล์ฟ</h1>
      <p className="text-lg text-gray-600 mb-8">(หน้านี้กำลังอยู่ระหว่างการพัฒนา...)</p>
      <Link 
        href="/" 
        className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
      >
        กลับหน้าแรก
      </Link>
    </main>
  );
}
