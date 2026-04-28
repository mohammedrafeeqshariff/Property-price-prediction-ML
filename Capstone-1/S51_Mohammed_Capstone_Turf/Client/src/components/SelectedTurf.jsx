import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTurfById } from '../features/turfs/turfSlice';
import { fetchAvailability, createBooking, clearBookingError } from '../features/bookings/bookingSlice';
import { 
  Users, 
  Clock, 
  MapPin, 
  Info, 
  ShieldCheck, 
  Star, 
  ParkingCircle, 
  Droplets, 
  Zap, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const SelectedTurf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedTurf, loading: turfLoading } = useSelector((state) => state.turf);
  const { availability, loading: bookingLoading, error: bookingError } = useSelector((state) => state.booking);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewers] = useState(Math.floor(Math.random() * 5) + 2);

  useEffect(() => {
    dispatch(fetchTurfById(id));
  }, [dispatch, id]);

  // Helper: get local YYYY-MM-DD string (avoids UTC timezone shift)
  const getLocalDate = (date) => date.toLocaleDateString('en-CA');

  useEffect(() => {
    const dateStr = getLocalDate(currentDate);
    dispatch(fetchAvailability({ turfId: id, date: dateStr }));
    
    const interval = setInterval(() => {
        dispatch(fetchAvailability({ turfId: id, date: getLocalDate(currentDate) }));
    }, 15000); 
    
    return () => clearInterval(interval);
  }, [dispatch, id, currentDate]);

  useEffect(() => {
    if (bookingError) {
      toast.error(bookingError);
      dispatch(clearBookingError());
    }
  }, [bookingError, dispatch]);

  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 6; i <= 22; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      slots.push(hour);
    }
    return slots;
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.warn("Please select a time slot first.");
      return;
    }

    const [startHour] = selectedSlot.split(':');
    const endHour = (parseInt(startHour) + 1).toString().padStart(2, '0') + ':00';
    
    const resultAction = await dispatch(createBooking({
      turfId: id,
      bookingDate: getLocalDate(currentDate),
      timeSlot: { start: selectedSlot, end: endHour },
      totalPrice: selectedTurf.turfPrice
    }));

    if (createBooking.fulfilled.match(resultAction)) {
      toast.success("Deployment Confirmed! Your slot is secured.");
      setSelectedSlot(null);
      dispatch(fetchAvailability({ turfId: id, date: getLocalDate(currentDate) }));
    }
  };

  if (turfLoading || !selectedTurf) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-widest animate-pulse uppercase">Syncing Arena Data...</p>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white p-4 lg:p-10 font-sans selection:bg-[#39FF14] selection:text-black">
      <button 
        onClick={() => navigate('/userHome')}
        className="flex items-center gap-2 text-gray-400 hover:text-[#39FF14] transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-tighter">Back to Arenas</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <img src={selectedTurf.turfThumbnail} className="w-full h-full object-cover" alt="Turf Hero" />
              <div className="absolute top-6 left-6 flex gap-2">
                <span className="bg-[#39FF14] text-black text-xs font-black px-3 py-1 rounded-full uppercase italic">Pro Grade</span>
                <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase border border-white/20">Verified Asset</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {selectedTurf.turfImages?.slice(0, 5).map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-800 hover:border-[#39FF14] transition-all cursor-pointer">
                  <img src={img} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1D23]/60 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase mb-2 italic leading-none">{selectedTurf.turfName}</h1>
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span className="flex items-center gap-1"><Star className="text-yellow-500" size={16} /> 4.9 (128 reviews)</span>
                  <span className="flex items-center gap-1 uppercase tracking-widest font-bold"><MapPin className="text-[#39FF14]" size={16} /> {selectedTurf.turfDistrict}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest block">Deployment Cost</span>
                <span className="text-3xl font-black text-[#39FF14] italic leading-tight">₹{selectedTurf.turfPrice}<span className="text-sm text-gray-500">/hr</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold uppercase tracking-tighter flex items-center gap-2">
                <Info className="text-[#39FF14]" size={20} />
                Arena Specifications
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">{selectedTurf.turfDescription}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Floodlights', icon: Zap },
                { label: 'Parking', icon: ParkingCircle },
                { label: 'Hydration', icon: Droplets },
                { label: 'Locker Rooms', icon: Users },
              ].map((amenity, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 bg-gray-900/50 rounded-2xl border border-gray-800 group hover:border-[#39FF14] transition-all">
                  <amenity.icon className="text-gray-500 group-hover:text-[#39FF14] transition-colors" size={24} />
                  <span className="text-[10px] font-black text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">{amenity.label}</span>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-[#39FF14]/5 rounded-2xl border border-[#39FF14]/20 flex items-center gap-4">
                <div className="p-3 bg-[#39FF14] text-black rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    <ShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="font-black uppercase italic tracking-tighter">Elite Player Protocol</h4>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">High-grade sanitation & professional impact-absorption flooring</p>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1A1D23] border border-gray-800 p-6 rounded-3xl sticky top-10 shadow-2xl space-y-6">
            <header className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Secure Booking</h2>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{viewers} LIVE VIEWERS</span>
                </div>
            </header>

            <div className="custom-calendar-container rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 p-2">
              <Calendar 
                onChange={setCurrentDate} 
                value={currentDate} 
                minDate={new Date()}
                className="sporty-calendar"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                <Clock size={16} className="text-[#39FF14]" />
                Select Mission Slot
              </h3>
              <div className="grid grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {generateTimeSlots().map((slot, i) => {
                  const isBooked = availability.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={i}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                        isBooked 
                        ? 'bg-gray-950 border-gray-900 text-gray-800 line-through cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'bg-[#39FF14] border-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-[1.05]'
                        : 'bg-black border-gray-800 text-gray-400 hover:border-[#39FF14] hover:text-[#39FF14]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSlot && (
              <div className="p-4 bg-gray-950 rounded-2xl border border-gray-800 space-y-2 animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Selected Date</span>
                    <span className="text-white">{currentDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span>Reserved Window</span>
                    <span className="text-white">{selectedSlot} - {(parseInt(selectedSlot) + 1).toString().padStart(2, '0')}:00</span>
                </div>
                <div className="h-[1px] bg-gray-800 my-2"></div>
                <div className="flex justify-between items-center bg-[#39FF14]/10 p-2 rounded-lg border border-[#39FF14]/10">
                    <span className="text-[10px] font-black text-[#39FF14] uppercase">Total Assessment</span>
                    <span className="text-xl font-black text-[#39FF14]">₹{selectedTurf.turfPrice}</span>
                </div>
              </div>
            )}

            <button 
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full bg-[#39FF14] disabled:bg-gray-700 text-black font-black py-5 rounded-2xl uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg shadow-[0_10px_30px_rgba(57,255,20,0.3)]"
            >
              {bookingLoading ? 'Processing...' : 'Confirm Deployment'}
            </button>
            <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest font-black">
              Zero Latency Confirmation & Real-time Update
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .sporty-calendar {
          background: transparent !important;
          border: none !important;
          color: white !important;
          width: 100% !important;
          font-family: inherit !important;
          font-size: 0.8rem !important;
        }
        .react-calendar__tile--now {
          background: #39FF1422 !important;
          color: #39FF14 !important;
        }
        .react-calendar__tile--active {
          background: #39FF14 !important;
          color: black !important;
          border-radius: 8px !important;
          font-weight: 900 !important;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #333 !important;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #333 !important;
          border-radius: 8px !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0B0E14;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #39FF14;
        }
      `}</style>
    </div>
  );
};

export default SelectedTurf;
