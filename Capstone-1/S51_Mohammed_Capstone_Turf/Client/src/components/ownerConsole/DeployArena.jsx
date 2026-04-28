import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import API from '../../services/api';
import {
  Upload, Trash2, PlusCircle, Activity, DollarSign,
  Clock, Users, CreditCard, MapPin
} from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_TIMINGS = DAYS.map(day => ({ day, start: '06:00', end: '22:00' }));

const DeployArena = ({ onTabChange }) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: { turfTimings: DEFAULT_TIMINGS }
  });
  const turfTimings = watch('turfTimings');

  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [turfImagesURL, setTurfImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleTimingChange = (index, field, value) => {
    const updated = turfTimings.map((t, i) => i === index ? { ...t, [field]: value } : t);
    setValue('turfTimings', updated);
  };

  const onThumbnailDrop = async (acceptedFiles) => {
    const thumbnail = acceptedFiles[0];
    if (!thumbnail) return;
    try {
      setIsUploading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, `thumbnails/${Date.now()}_${thumbnail.name}`);
      await uploadBytes(storageRef, thumbnail);
      setThumbnailURL(await getDownloadURL(storageRef));
      toast.success('Deployment Marker Ready (Thumbnail uploaded)');
    } catch {
      toast.error('Asset upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const onImagesDrop = async (acceptedFiles) => {
    if (turfImagesURL.length + acceptedFiles.length > 5) {
      toast.error('Max 5 strategic images allowed.');
      return;
    }
    try {
      setIsUploading(true);
      const storage = getStorage(app);
      const urls = await Promise.all(acceptedFiles.map(async (file) => {
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      }));
      setTurfImages(prev => [...prev, ...urls]);
      toast.success('Battlefield gallery updated!');
    } catch {
      toast.error('Tactical image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!thumbnailURL) {
      toast.error('Deployment requires a primary visual (Thumbnail).');
      return;
    }
    setIsUploading(true);
    try {
      await API.post('/turfs/upload', { ...data, turfThumbnail: thumbnailURL, turfImages: turfImagesURL });
      toast.success('Objective Secured: Turf Listed Successfully!');
      reset({ turfTimings: DEFAULT_TIMINGS });
      setThumbnailURL(null);
      setTurfImages([]);
      onTabChange('dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failure.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps: getThumbProps, getInputProps: getThumbInput } = useDropzone({ onDrop: onThumbnailDrop, accept: { 'image/*': [] }, multiple: false });
  const { getRootProps: getImagesProps, getInputProps: getImagesInput } = useDropzone({ onDrop: onImagesDrop, accept: { 'image/*': [] }, multiple: true });

  const inputCls = 'w-full bg-black/60 border border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#39FF14] transition-all font-black text-sm';
  const labelCls = 'text-[10px] font-black text-[#39FF14] uppercase tracking-widest';

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-8 flex justify-between items-center">
        <h3 className="text-2xl font-black uppercase tracking-tight italic">Deployment Configuration</h3>
        <button onClick={() => onTabChange('dashboard')} className="text-xs font-black uppercase tracking-widest text-[#39FF14] hover:underline">
          Cancel Mission
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-[#1A1D23]/60 backdrop-blur-md border border-gray-800 p-10 rounded-3xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Image Uploads */}
          <div className="space-y-8">
            {/* Thumbnail */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex justify-between items-center">
                Primary Asset Identification <span className="text-[10px] italic">Target Visual</span>
              </label>
              <div {...getThumbProps()} className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-500 ${thumbnailURL ? 'border-transparent' : 'border-gray-800 hover:border-[#39FF14] bg-black/40 cursor-pointer'}`}>
                <input {...getThumbInput()} />
                {thumbnailURL ? (
                  <>
                    <img src={thumbnailURL} className="absolute inset-0 w-full h-full object-cover rounded-3xl" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setThumbnailURL(null); }} className="p-3 bg-red-600 rounded-2xl hover:bg-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-800 text-[#39FF14]">
                      <Upload size={32} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">Lock Thumbnail</p>
                    <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-widest">DRAG-DROP RECOMMENDED</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Atmosphere Gallery (Max 5)</label>
              <div {...getImagesProps()} className="border-2 border-dashed border-gray-800 hover:border-[#39FF14] bg-black/40 p-10 rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center group">
                <input {...getImagesInput()} />
                <PlusCircle size={32} className="text-[#39FF14] opacity-40 group-hover:opacity-100 transition-opacity mb-2" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Strategic Shots Only</p>
              </div>
              <div className="flex gap-4 mt-4 overflow-x-auto pb-4 scrollbar-hide">
                {turfImagesURL.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 flex-shrink-0 group">
                    <img src={url} className="w-full h-full object-cover rounded-2xl border border-gray-800" alt={`Gallery ${i}`} />
                    <button type="button" onClick={() => setTurfImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 p-1.5 bg-red-600 rounded-lg hover:bg-red-700 opacity-0 group-hover:opacity-100 scale-75">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className={labelCls}>Arena Designation</label>
              <input {...register('turfName', { required: true })} placeholder="e.g. Thunder Dome Elite" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Domain Category</label>
              <select {...register('turfSportCategory', { required: true })} className={`${inputCls} appearance-none cursor-pointer`}>
                <option value="Football">Tactical Football</option>
                <option value="Cricket">Power Play Cricket</option>
                <option value="Basketball">High-Jump Basketball</option>
                <option value="Badminton">Precision Badminton</option>
                <option value="Tennis">Grand Slam Tennis</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={`${labelCls} flex items-center gap-2`}><Users size={12} /> Contact Name</label>
                <input {...register('ownerName', { required: true })} placeholder="Owner Name" className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={`${labelCls} flex items-center gap-2`}><CreditCard size={12} /> Contact No.</label>
                <input type="number" {...register('ownerContact', { required: true })} placeholder="91-XXXXX-XXXXX" className={inputCls} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={`${labelCls} flex items-center gap-2`}><Activity size={12} /> Contact Email</label>
              <input type="email" {...register('ownerEmail', { required: true })} placeholder="operations@arena.com" className={inputCls} />
            </div>
            <div className="space-y-2">
              <label className={labelCls + ' italic'}>Description</label>
              <textarea {...register('turfDescription', { required: true })} className={`${inputCls} min-h-[100px] resize-none`} placeholder="Input unique advantages & premium specs..." />
            </div>
            <div className="space-y-2">
              <label className={`${labelCls} flex items-center gap-2`}><MapPin size={12} /> Full Address</label>
              <input {...register('address', { required: true })} placeholder="e.g. 12 Main St, Chennai, 600001" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>Price / HR</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
                  <input type="number" {...register('turfPrice', { required: true })} placeholder="000" className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Sector (District)</label>
                <select {...register('turfDistrict', { required: true })} className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="Chennai">Central Chennai</option>
                  <option value="Madurai">South Madurai</option>
                  <option value="Coimbatore">Western Kovai</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Timings */}
        <div className="border-t border-gray-800/50 pt-10 mt-4">
          <header className="flex justify-between items-center mb-8">
            <h4 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Clock className="text-[#39FF14]" size={24} /> Uptime Protocol
            </h4>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Military Grade Timings</span>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turfTimings.map((timing, index) => (
              <div key={index} className="flex items-center gap-6 bg-black/40 p-5 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors">
                <span className="w-24 text-xs font-black text-gray-500 uppercase tracking-tighter">{timing.day}</span>
                <div className="flex-1 flex items-center gap-3">
                  <input type="time" value={timing.start} onChange={(e) => handleTimingChange(index, 'start', e.target.value)} className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 focus:border-[#39FF14] outline-none text-[10px] font-black" />
                  <span className="text-gray-700 text-xs font-black uppercase tracking-tighter">to</span>
                  <input type="time" value={timing.end} onChange={(e) => handleTimingChange(index, 'end', e.target.value)} className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 focus:border-[#39FF14] outline-none text-[10px] font-black" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isUploading} className="w-full bg-[#39FF14] text-black font-black py-6 rounded-3xl uppercase tracking-tighter hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-4 text-xl shadow-[0_15px_40px_rgba(57,255,20,0.3)] mt-4 group">
          {isUploading ? (
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Activity size={24} className="group-hover:rotate-12 transition-transform" /> Finalize Deployment</>
          )}
        </button>
      </form>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default DeployArena;
