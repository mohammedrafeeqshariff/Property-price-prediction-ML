'use client';
import { Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Topbar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      setAdminName(JSON.parse(admin).name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full ml-64 max-w-[calc(100%-16rem)]">
      <div className="font-semibold text-lg text-textMain capitalize">
        Overview
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-6">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
            {adminName.charAt(0)}
          </div>
          <span className="font-medium text-sm text-textMain">{adminName}</span>
          
          <button onClick={handleLogout} className="text-gray-400 hover:text-danger ml-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
