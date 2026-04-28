import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings } from '../features/bookings/bookingSlice';
import { 
    Calendar, 
    ChevronLeft, 
    Clock, 
    MapPin, 
    Activity,
    CreditCard,
    Trophy,
    History,
    Timer
} from 'lucide-react';

const MyBookings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { bookings, loading } = useSelector((state) => state.booking);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchMyBookings());
    }, [dispatch]);

    const recentBookings = bookings.filter(b => b.status === 'confirmed').slice(0, 3);
    const bookingHistory = bookings.slice(3);

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans selection:bg-[#39FF14] selection:text-black">
            {/* Nav Header */}
            <nav className="border-b border-gray-800/50 bg-[#1A1D23]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#39FF14] transition-colors group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-black uppercase tracking-tighter">Back</span>
                    </button>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter">Personnel <span className="text-[#39FF14]">Deployments</span></h1>
                    <div className="w-10 h-10 rounded-full border border-gray-800 p-0.5 overflow-hidden">
                        {user?.profileImage ? (
                             <img src={user.profileImage} className="w-full h-full object-cover rounded-full" alt="Profile" />
                        ) : (
                             <div className="w-full h-full bg-gray-900 flex items-center justify-center text-[#39FF14] font-black">{user?.name?.charAt(0)}</div>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats / Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#1A1D23] border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
                        <Activity className="absolute -right-4 -bottom-4 text-[#39FF14]/5 group-hover:text-[#39FF14]/10 transition-colors" size={120} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Deployments</p>
                        <h3 className="text-3xl font-black italic tracking-tighter">{bookings.length}</h3>
                    </div>
                    <div className="bg-[#1A1D23] border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
                        <Trophy className="absolute -right-4 -bottom-4 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" size={120} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Readiness</p>
                        <h3 className="text-3xl font-black italic tracking-tighter">{recentBookings.length}</h3>
                    </div>
                    <div className="bg-[#1A1D23] border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
                        <CreditCard className="absolute -right-4 -bottom-4 text-orange-500/5 group-hover:text-orange-500/10 transition-colors" size={120} />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Expenditure</p>
                        <h3 className="text-3xl font-black italic tracking-tighter">₹{bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)}</h3>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 opacity-50">
                        <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-black uppercase tracking-widest">Scanning Archive...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#1A1D23]/30 rounded-3xl border border-gray-800/50">
                        <History size={48} className="mx-auto text-gray-700 mb-4" />
                        <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">No Deployments Found</h3>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">You haven't locked in any turfs yet.</p>
                        <NavLink to="/userHome" className="inline-block mt-6 px-8 py-3 bg-[#39FF14] text-black font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all">Start Recon</NavLink>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Recent Bookings */}
                        {recentBookings.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-6">
                                    <Timer size={18} className="text-[#39FF14]" />
                                    <h2 className="text-lg font-black uppercase tracking-tighter italic">Recent Deployments</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {recentBookings.map((b) => (
                                        <div key={b._id} className="bg-[#1A1D23] border border-gray-800 rounded-3xl p-6 hover:border-[#39FF14]/30 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center font-black text-[#39FF14] text-xs">
                                                    #{b._id.slice(-4).toUpperCase()}
                                                </div>
                                                <span className="text-[10px] font-black text-[#39FF14] bg-[#39FF14]/10 px-2 py-1 rounded-lg border border-[#39FF14]/20 uppercase tracking-widest">Confirmed</span>
                                            </div>
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-1">{b.turfId?.turfName}</h4>
                                            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 italic">
                                                <MapPin size={12} /> {b.turfId?.turfDistrict}
                                            </div>
                                            <div className="space-y-3 bg-black/40 rounded-2xl p-4 border border-gray-800/50">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-600 font-black uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Date</span>
                                                    <span className="font-black italic">{b.bookingDate}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-600 font-black uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Window</span>
                                                    <span className="font-black italic">{b.timeSlot?.start} - {b.timeSlot?.end}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* History */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <History size={18} className="text-gray-500" />
                                <h2 className="text-lg font-black uppercase tracking-tighter italic text-gray-500">Archive Log</h2>
                            </div>
                            <div className="bg-[#1A1D23]/60 border border-gray-800 rounded-3xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-800">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Arena</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Deployment Window</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Operational Cost</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/50">
                                        {(bookingHistory.length > 0 ? bookingHistory : bookings).map((b) => (
                                            <tr key={b._id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-black uppercase tracking-tighter">{b.turfId?.turfName}</p>
                                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">{b.turfId?.turfDistrict}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-black italic">{b.bookingDate}</p>
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{b.timeSlot?.start} - {b.timeSlot?.end}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-black font-mono">₹{b.totalPrice}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-[10px] font-black text-gray-500 bg-gray-500/5 px-2 py-1 rounded-md border border-gray-500/20 uppercase tracking-widest">Processed</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyBookings;
