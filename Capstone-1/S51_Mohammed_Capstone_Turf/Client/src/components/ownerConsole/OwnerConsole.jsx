import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { LayoutDashboard, PlusCircle, Settings, Calendar as CalendarIcon, DollarSign, Activity, LogOut } from 'lucide-react';
import CommandCenter from './CommandCenter';
import DeployArena from './DeployArena';
import AssetControl from './AssetControl';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'upload',    label: 'Deploy Arena',   icon: PlusCircle },
  { id: 'manage',   label: 'Asset Control',  icon: Settings },
];

const OwnerConsole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const tabTitles = {
    dashboard: 'Strategic Overview',
    upload: 'Deployment Configuration',
    manage: 'Asset Control',
  };

  return (
    <div className="flex min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-[#39FF14] selection:text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1D23] border-r border-gray-800 flex flex-col p-6 sticky top-0 h-screen z-50">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#39FF14] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <Activity className="text-black" size={24} />
          </div>
          <h1 className="text-xl font-black italic tracking-tighter">OWNER<span className="text-[#39FF14]">HUB</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border ${
                activeTab === item.id
                  ? 'bg-[#39FF14] border-[#39FF14] text-black shadow-[0_5px_15px_rgba(57,255,20,0.2)]'
                  : 'border-transparent text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-black uppercase tracking-tighter text-sm">{item.label}</span>
            </button>
          ))}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <CalendarIcon size={20} />
              <span className="font-black uppercase tracking-tighter text-sm">Engagement Logs</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
              <DollarSign size={20} />
              <span className="font-black uppercase tracking-tighter text-sm">Revenue Matrix</span>
            </button>
          </div>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group mt-auto">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-tighter text-sm">Abort Session</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">{tabTitles[activeTab]}</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">
              Personnel: <span className="text-[#39FF14]">{user?.name}</span> | Command Authorized
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1D23] px-4 py-2 rounded-full border border-gray-800 shadow-2xl">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_#39FF14]" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Sync Status: Stable</span>
          </div>
        </header>

        {activeTab === 'dashboard' && <CommandCenter />}
        {activeTab === 'upload'    && <DeployArena   onTabChange={handleTabChange} />}
        {activeTab === 'manage'    && <AssetControl  onTabChange={handleTabChange} />}
      </main>
    </div>
  );
};

export default OwnerConsole;
