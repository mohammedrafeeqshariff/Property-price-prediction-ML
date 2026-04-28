import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerTurfs, updateOwnerTurf, deleteOwnerTurf } from '../../features/turfs/turfSlice';
import { toast } from 'react-toastify';
import { MapPin, PlusCircle, Settings, Trash2 } from 'lucide-react';

const AssetControl = ({ onTabChange }) => {
  const dispatch = useDispatch();
  const { ownerTurfs, ownerTurfsLoading } = useSelector((state) => state.turf);
  const [editingTurf, setEditingTurf] = useState(null);
  const [deletingTurfId, setDeletingTurfId] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const result = await dispatch(fetchOwnerTurfs());
      if (fetchOwnerTurfs.rejected.match(result)) {
        toast.error(result.payload || 'Failed to sync assets with command center.');
      }
    };
    fetchAssets();
  }, [dispatch]);

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingTurf) return;
    const result = await dispatch(updateOwnerTurf({ id: editingTurf._id, data: editingTurf }));
    if (updateOwnerTurf.fulfilled.match(result)) {
      toast.success('Arena updated successfully!');
      setEditingTurf(null);
    } else {
      toast.error(result.payload || 'Update failed.');
    }
  };

  const handleDeleteTurf = async () => {
    if (!deletingTurfId) return;
    const result = await dispatch(deleteOwnerTurf(deletingTurfId));
    if (deleteOwnerTurf.fulfilled.match(result)) {
      toast.success('Arena decommissioned.');
    } else {
      toast.error(result.payload || 'Delete failed.');
    }
    setDeletingTurfId(null);
  };

  const inputCls = 'w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-sm font-black focus:outline-none focus:border-[#39FF14] transition-all';
  const labelCls = 'text-[10px] font-black text-[#39FF14] uppercase tracking-widest';

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Asset Control</h3>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">
              {ownerTurfs.length} Arena{ownerTurfs.length !== 1 ? 's' : ''} Deployed
            </p>
          </div>
          <button
            onClick={() => onTabChange('upload')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#39FF14] text-black font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all text-sm"
          >
            <PlusCircle size={16} /> Deploy New
          </button>
        </div>

        {/* Content */}
        {ownerTurfsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-[#1A1D23] rounded-3xl h-72 animate-pulse border border-gray-800" />)}
          </div>
        ) : ownerTurfs.length === 0 ? (
          <div className="text-center py-24 bg-[#1A1D23]/40 border border-gray-800/50 rounded-3xl">
            <Settings size={48} className="mx-auto text-gray-700 mb-4" />
            <h4 className="text-xl font-black uppercase italic tracking-tighter mb-2">No Assets Deployed</h4>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-black mb-6">Head to Deploy Arena to list your first turf.</p>
            <button onClick={() => onTabChange('upload')} className="px-8 py-3 bg-[#39FF14] text-black font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-all">
              Deploy First Arena
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ownerTurfs.map((turf) => (
              <div key={turf._id} className="bg-[#1A1D23] border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all group">
                <div className="relative aspect-video">
                  <img
                    src={turf.turfThumbnail || 'https://via.placeholder.com/400x225'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={turf.turfName}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-black bg-[#39FF14]/20 text-[#39FF14] px-2 py-1 rounded-lg border border-[#39FF14]/20 uppercase tracking-widest">Live</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
                      <MapPin size={10} className="text-[#39FF14]" />{turf.turfDistrict}
                    </p>
                    <h4 className="text-lg font-black uppercase italic tracking-tighter">{turf.turfName}</h4>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-black uppercase tracking-widest">{turf.turfSportCategory}</span>
                    <span className="text-[#39FF14] font-black italic">₹{turf.turfPrice}<span className="text-gray-600">/hr</span></span>
                  </div>
                  <p className="text-gray-500 text-[11px] line-clamp-2">{turf.turfDescription}</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => setEditingTurf({ ...turf })}
                      className="flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-tighter text-xs rounded-xl transition-all"
                    >
                      <Settings size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingTurfId(turf._id)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-black uppercase tracking-tighter text-xs rounded-xl transition-all border border-red-500/20"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTurf && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setEditingTurf(null)}>
          <form onSubmit={handleSaveEdit} onClick={e => e.stopPropagation()} className="bg-[#1A1D23] border border-gray-800 rounded-3xl p-8 w-full max-w-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Edit Arena</h3>
              <button type="button" onClick={() => setEditingTurf(null)} className="text-gray-500 hover:text-white text-2xl font-black">×</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelCls}>Arena Name</label>
                <input value={editingTurf.turfName || ''} onChange={e => setEditingTurf(p => ({ ...p, turfName: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Price / hr (₹)</label>
                <input type="number" value={editingTurf.turfPrice || ''} onChange={e => setEditingTurf(p => ({ ...p, turfPrice: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>District</label>
                <input value={editingTurf.turfDistrict || ''} onChange={e => setEditingTurf(p => ({ ...p, turfDistrict: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Sport Category</label>
                <select value={editingTurf.turfSportCategory || ''} onChange={e => setEditingTurf(p => ({ ...p, turfSportCategory: e.target.value }))} className={`${inputCls} appearance-none`}>
                  {['Football', 'Cricket', 'Basketball', 'Badminton', 'Tennis'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Owner Name</label>
                <input value={editingTurf.ownerName || ''} onChange={e => setEditingTurf(p => ({ ...p, ownerName: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Contact Number</label>
                <input type="number" value={editingTurf.ownerContact || ''} onChange={e => setEditingTurf(p => ({ ...p, ownerContact: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Contact Email</label>
              <input type="email" value={editingTurf.ownerEmail || ''} onChange={e => setEditingTurf(p => ({ ...p, ownerEmail: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Address</label>
              <input value={editingTurf.address || ''} onChange={e => setEditingTurf(p => ({ ...p, address: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>Description</label>
              <textarea value={editingTurf.turfDescription || ''} onChange={e => setEditingTurf(p => ({ ...p, turfDescription: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button type="button" onClick={() => setEditingTurf(null)} className="py-3 rounded-xl bg-gray-800 text-gray-400 font-black uppercase tracking-tighter hover:bg-gray-700 transition-all">Cancel</button>
              <button type="submit" className="py-3 rounded-xl bg-[#39FF14] text-black font-black uppercase tracking-tighter hover:scale-[1.02] transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingTurfId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setDeletingTurfId(null)}>
          <div className="bg-[#1A1D23] border border-gray-800 rounded-3xl p-8 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Decommission Arena?</h3>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-black mb-8">This action is permanent and cannot be undone.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setDeletingTurfId(null)} className="py-3 rounded-xl bg-gray-800 text-gray-400 font-black uppercase tracking-tighter hover:bg-gray-700 transition-all">Cancel</button>
              <button onClick={handleDeleteTurf} className="py-3 rounded-xl bg-red-500 text-white font-black uppercase tracking-tighter hover:bg-red-600 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetControl;
