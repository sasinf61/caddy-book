import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Flag, Zap } from 'lucide-react';

interface NavItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const HomeNavigation: React.FC = () => {
  const navItems: NavItem[] = [
    {
      title: 'สนามกอล์ฟ',
      description: 'ค้นหาแคดดี้จากสนาม',
      icon: <Flag className="w-10 h-10 text-white" />,
      href: '/golf-courses'
    },
    {
      title: 'แคดดี้ทั้งหมด',
      description: 'ดูแคดดี้ที่ลงทะเบียน',
      icon: <Users className="w-10 h-10 text-white" />,
      href: '/caddies'
    },
    {
      title: 'จังหวัด',
      description: 'ค้นหาสนามกอล์ฟในพื้นที่',
      icon: <MapPin className="w-10 h-10 text-white" />,
      href: '/provinces'
    },
    {
      title: 'แคดดี้ด่วน',
      description: 'ค้นหาแคดดี้ที่ว่างวันนี้',
      icon: <Zap className="w-10 h-10 text-white" />,
      href: '/caddies/express'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="group block p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-2xl transition-all duration-300 hover:bg-white/20"
        >
          <div className="flex flex-col items-start space-y-3">
            <div>{item.icon}</div>
            <h3 className="font-bold text-lg text-white font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-300">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default HomeNavigation;
