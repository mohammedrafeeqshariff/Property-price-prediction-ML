import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Activity, ChevronRight, Play, Shield, Zap } from 'lucide-react';

const Start = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'owner') navigate('/ownerHome');
      else navigate('/userHome');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans overflow-hidden selection:bg-[#39FF14] selection:text-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#39FF14]/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="relative z-10 flex px-8 py-8 justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#39FF14] rounded-lg flex items-center justify-center">
                <Activity className="text-black" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">TURF<span className="text-[#39FF14]">HUB</span></h1>
        </div>
        
        <nav className="flex items-center gap-6">
          <NavLink
            to="/login"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="bg-[#39FF14] text-black px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-tighter hover:scale-105 transition-all shadow-[0_0_20px_rgba(57,255,20,0.3)]"
          >
            Join the Hub
          </NavLink>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
            <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#39FF14]">Next-Gen Turf Booking Platform</span>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic italic leading-[0.9]">
                Elevate Your <span className="text-[#39FF14]">Match Day</span> Experience
            </h2>
            
            <p className="text-gray-400 text-lg font-bold uppercase tracking-widest leading-relaxed max-w-xl">
                The most advanced booking system for athletes. Real-time availability, premium AI assistance, and elite arenas at your fingertips.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <NavLink 
                    to="/signup" 
                    className="group bg-[#39FF14] text-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-black uppercase tracking-tighter hover:scale-[1.02] transition-all shadow-[0_15px_30px_rgba(57,255,20,0.2)]"
                >
                    Get Started <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </NavLink>
                <button className="flex items-center justify-center gap-4 group px-10 py-5">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                        <Play size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Watch the Demo</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-800/50">
                {[
                    { label: 'Active Arenas', value: '500+' },
                    { label: 'Pro Players', value: '10K+' },
                    { label: 'Bookings/Day', value: '2.5K' },
                ].map((stat, i) => (
                    <div key={i}>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-[#39FF14]/5 blur-[100px] rounded-full scale-150"></div>
            <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-[4rem] border border-gray-800 rotate-3 overflow-hidden shadow-2xl group hover:rotate-0 transition-transform duration-700">
                <div className="absolute inset-0 bg-[#39FF14]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {/* Visual representation of a turf/dashboard */}
                <div className="p-10 h-full flex flex-col justify-end">
                    <div className="space-y-4">
                         <div className="flex gap-2">
                            <Zap className="text-[#39FF14]" />
                            <Shield className="text-blue-500" />
                         </div>
                         <h3 className="text-3xl font-black uppercase tracking-tighter italic">Pro Gear Ready</h3>
                         <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-[#39FF14] animate-pulse"></div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-gray-900 py-10 px-8 text-center text-gray-600">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 TURFHUB NETWORK. ALL RIGHTS RESERVED. POWERED BY AI.</p>
      </footer>
    </div>
  );
};

export default Start;
