import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  Search, Activity, LogOut, User, Compass,
  Calendar as CalendarIcon, Filter
} from 'lucide-react';
import chatbotimage from '../../assets/chatbot.png';
import TurfExplorer from './TurfExplorer';

const SPORTS = ['All', 'Football', 'Cricket', 'Badminton', 'Basketball', 'Tennis'];

const UserConsole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const scrollToExplore = () => {
    document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-[#39FF14] selection:text-black">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center">
            <Activity className="text-black" size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">TURF<span className="text-[#39FF14]">HUB</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={scrollToExplore} className="text-gray-400 hover:text-[#39FF14] text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
            <Compass size={16} /> Explore
          </button>
          <NavLink to="/myBookings" className="text-gray-400 hover:text-[#39FF14] text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
            <CalendarIcon size={16} /> Bookings
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => document.getElementById('logout_modal').showModal()} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
          <NavLink to="/profile" className="w-10 h-10 rounded-full border-2 border-[#39FF14] overflow-hidden p-0.5 hover:scale-110 transition-transform">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
              {user?.profileImage
                ? <img src={user.profileImage} className="w-full h-full object-cover rounded-full" alt="Profile" />
                : <User className="text-[#39FF14]" size={20} />}
            </div>
          </NavLink>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative py-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[#39FF14]/5 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 italic leading-none">
            Find your <span className="text-[#39FF14]">Field of Play</span>
          </h1>
          <p className="text-gray-400 text-lg uppercase tracking-widest font-bold mb-10 max-w-2xl mx-auto">
            Elite Arenas. Real-time Booking. Pro Performance.
          </p>

          {/* Search Bar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex flex-col md:flex-row gap-4 bg-[#1A1D23] p-2 rounded-2xl border border-gray-800">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Search by arena name or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none py-3 pl-12 pr-4 focus:ring-0 text-white placeholder:text-gray-600 font-bold"
                />
              </div>
              <div className="h-full w-[1px] bg-gray-800 hidden md:block self-center py-4" />
              <div className="flex items-center gap-2 px-4 scrollbar-hide overflow-x-auto">
                <Filter size={16} className="text-[#39FF14]" />
                {SPORTS.map(sport => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap ${selectedSport === sport ? 'bg-[#39FF14] text-black' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Turf Explorer */}
      <main id="explore-section" className="max-w-7xl mx-auto px-6 pb-20">
        <TurfExplorer searchTerm={searchTerm} selectedSport={selectedSport} />
      </main>

      {/* Logout Modal */}
      <dialog id="logout_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-[#1A1D23] border border-gray-800 rounded-3xl p-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <LogOut size={32} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-center italic">Terminate Session?</h3>
          <p className="py-4 text-gray-400 text-center font-bold uppercase tracking-widest text-xs">Are you sure you want to exit the hub?</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <form method="dialog">
              <button className="w-full py-4 rounded-2xl bg-gray-800 text-gray-400 font-black uppercase tracking-tighter hover:bg-gray-700 transition-all">Cancel</button>
            </form>
            <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-[#39FF14] text-black font-black uppercase tracking-tighter hover:scale-[1.02] transition-all">
              Yes, Logout
            </button>
          </div>
        </div>
      </dialog>

      {/* AI Chatbot FAB */}
      <div className="fixed bottom-8 right-8 z-[60] group">
        <div className="absolute -inset-2 bg-[#39FF14] rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse transition-all" />
        <NavLink to="/AiChatBot">
          <button className="relative w-16 h-16 bg-[#1A1D23] border border-gray-800 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all active:scale-95">
            <img src={chatbotimage} alt="AI" className="w-10 h-10 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#39FF14] rounded-full border-4 border-[#0B0E14]" />
          </button>
        </NavLink>
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#1A1D23] border border-gray-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#39FF14] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 w-32 pointer-events-none">
          Ask Turf AI Hub
        </div>
      </div>

      <style>{`
        .modal::backdrop { background: rgba(0,0,0,0.9); backdrop-filter: blur(8px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default UserConsole;
