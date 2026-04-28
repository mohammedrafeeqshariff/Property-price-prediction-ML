import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerBookings } from '../../features/bookings/bookingSlice';
import { CalendarIcon, CreditCard, Activity, ChevronRight, TrendingUp } from 'lucide-react';

const CommandCenter = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0 });

  useEffect(() => {
    dispatch(fetchOwnerBookings());
    const interval = setInterval(() => dispatch(fetchOwnerBookings()), 15000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (bookings.length > 0) {
      const revenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
      setStats({ totalBookings: bookings.length, totalRevenue: revenue });
    }
  }, [bookings]);

  const statCards = [
    { label: 'Active Deployments', value: stats.totalBookings, icon: CalendarIcon, color: 'text-[#39FF14]', trend: '+8%' },
    { label: 'Total Revenue Matrix', value: `₹${stats.totalRevenue}`, icon: CreditCard, color: 'text-blue-500', trend: '+22.4%' },
    { label: 'Operational Assets', value: 'Live', icon: Activity, color: 'text-orange-500', trend: 'STABLE' },
  ];

  const performanceBars = [
    { label: 'Booking Fluidity', value: 85, color: 'bg-blue-500' },
    { label: 'Asset Utilization', value: 42, color: 'bg-[#39FF14]' },
    { label: 'Growth Vector', value: 65, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 slide-in-from-top-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#1A1D23]/60 backdrop-blur-md border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-gray-700 transition-all">
            <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 bg-gray-900 rounded-2xl ${stat.color} border border-white/5 shadow-2xl`}>
                <stat.icon size={32} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</span>
                <span className="text-xs font-black text-[#39FF14] bg-[#39FF14]/10 px-2 py-1 rounded-lg border border-[#39FF14]/20">{stat.trend}</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
            <p className="text-4xl font-black mt-2 tracking-tighter italic">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Booking Table + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Booking Table */}
        <div className="lg:col-span-2 bg-[#1A1D23]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Live Engagement Tracking</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Real-time status of current reservations</p>
            </div>
            <button className="text-[10px] font-black text-[#39FF14] hover:underline uppercase tracking-widest">Full Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Asset', 'Status', 'Window', 'Action'].map(h => (
                    <th key={h} className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-600 font-black uppercase tracking-widest text-xs italic">
                      No active engagements detected.
                    </td>
                  </tr>
                ) : bookings.slice(0, 5).map((b, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center font-black text-[#39FF14] text-xs">
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tighter text-white">Reservation</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 italic">{b.turfId?.turfName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border ${b.status === 'confirmed' ? 'text-[#39FF14] border-[#39FF14]/20 bg-[#39FF14]/5' : 'text-orange-500 border-orange-500/20 bg-orange-500/5'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-[10px] text-gray-400">
                      {b.timeSlot?.start} - {b.timeSlot?.end}
                    </td>
                    <td className="py-4">
                      <button className="p-2 hover:text-[#39FF14] transition-colors"><ChevronRight size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Mix */}
        <div className="bg-[#1A1D23]/60 backdrop-blur-md border border-gray-800 rounded-3xl p-8 flex flex-col">
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Performance Mix</h3>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {performanceBars.map((p, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">{p.label}</span>
                  <span className="text-white">{p.value}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                  <div className={`h-full ${p.color} transition-all duration-1000`} style={{ width: `${p.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-[#39FF14]/5 rounded-2xl border border-[#39FF14]/10 text-center">
            <TrendingUp size={24} className="mx-auto text-[#39FF14] mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Revenue up 15% this meta-cycle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
