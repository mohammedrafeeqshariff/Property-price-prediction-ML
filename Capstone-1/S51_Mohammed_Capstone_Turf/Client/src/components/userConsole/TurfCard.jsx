import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Flame, ChevronRight } from 'lucide-react';

const TurfCard = ({ turf }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group bg-[#1A1D23]/60 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden hover:border-[#39FF14]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={turf.turfThumbnail || 'https://via.placeholder.com/800x400'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={turf.turfName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <Flame size={12} className="text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-white">Booked 8x today</span>
          </div>
          <div className="flex items-center gap-1 text-[#39FF14] bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-black">4.9</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black tracking-tighter uppercase italic line-clamp-1">{turf.turfName}</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <MapPin size={10} className="text-[#39FF14]" /> {turf.turfDistrict}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#39FF14] text-xl font-black italic uppercase tracking-tighter">₹{turf.turfPrice}</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">PER HOUR</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed flex-grow">{turf.turfDescription}</p>

        <button
          onClick={() => navigate(`/selectedTurf/${turf._id}`)}
          className="w-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 hover:bg-[#39FF14] hover:text-black py-4 rounded-2xl text-sm font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 group/btn"
        >
          View Details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default TurfCard;
