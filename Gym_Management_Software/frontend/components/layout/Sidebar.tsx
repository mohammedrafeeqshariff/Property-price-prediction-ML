'use client';
import { LayoutDashboard, Users, UserCheck, CreditCard, DollarSign, MessageSquare, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'Trainers', href: '/trainers', icon: UserCheck },
    { name: 'Plans', href: '/plans', icon: CreditCard },
    { name: 'Payments', href: '/payments', icon: DollarSign },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Reminders', href: '/reminders', icon: Bell },
  ];

  return (
    <div className="w-64 bg-sidebar min-h-screen text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 font-bold text-2xl tracking-wide border-b border-white/10">
        <span className="text-primary">GYM</span>ADMIN
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link key={link.name} href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
