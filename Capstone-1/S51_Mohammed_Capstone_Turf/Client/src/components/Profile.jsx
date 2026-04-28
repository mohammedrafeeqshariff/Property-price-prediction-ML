import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { 
  User, 
  Mail, 
  Info, 
  Camera, 
  ArrowLeft, 
  Save, 
  Activity,
  Shield
} from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        about: '',
        profileImage: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                about: user.about || '',
                profileImage: user.profileImage || ''
            });
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(updateProfile(formData));
        if (updateProfile.fulfilled.match(resultAction)) {
            toast.success("Profile synchronized with the hub!");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans p-6 lg:p-10 selection:bg-[#39FF14] selection:text-black">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#39FF14] transition-colors mb-10 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-black uppercase tracking-tighter">Exit Settings</span>
                </button>

                <header className="mb-12 relative">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#39FF14]/10 blur-[100px] rounded-full"></div>
                    <div className="relative z-10 flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-gray-800 bg-gray-900 flex items-center justify-center p-1 group-hover:border-[#39FF14] transition-all duration-500">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} className="w-full h-full object-cover rounded-2xl" alt="Profile" />
                                ) : (
                                    <User size={64} className="text-gray-700" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-[#39FF14] text-black rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                                <Camera size={18} />
                            </div>
                        </div>
                        <div className="pb-2">
                             <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">Player <span className="text-[#39FF14]">Profile</span></h1>
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Shield size={12} className="text-blue-500" /> Authentication Verified: {user?.role}
                             </p>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="bg-[#1A1D23]/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={14} className="text-[#39FF14]" /> Operational Identity
                                </label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Player Full Name"
                                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 focus:border-[#39FF14] focus:ring-0 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Camera size={14} className="text-[#39FF14]" /> Profile Image URL
                                </label>
                                <input 
                                    type="text" 
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 focus:border-[#39FF14] focus:ring-0 transition-all font-bold placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} className="text-[#39FF14]" /> Primary Contact (Read-Only)
                            </label>
                            <div className="w-full bg-gray-900/30 border border-gray-800/30 rounded-2xl py-4 px-6 text-gray-600 font-bold italic">
                                {user?.email}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Info size={14} className="text-[#39FF14]" /> Mission Brief / About
                            </label>
                            <textarea 
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                placeholder="Tell us about your professional background or play style..."
                                className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 focus:border-[#39FF14] focus:ring-0 transition-all font-bold placeholder:text-gray-700 h-32 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#39FF14] text-black py-5 rounded-2xl font-black uppercase tracking-tighter text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(57,255,20,0.2)]"
                        >
                            {loading ? 'Synchronizing...' : (
                                <>
                                    <Save size={20} /> Deploy Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <footer className="mt-20 pt-10 border-t border-gray-900">
                    <div className="flex items-center gap-3 opacity-30 grayscale">
                        <Activity className="text-[#39FF14]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">TurfHub Core Performance Engine v4.2</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Profile;

