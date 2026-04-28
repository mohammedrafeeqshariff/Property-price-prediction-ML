import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTurfs } from '../../features/turfs/turfSlice';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TurfCard from './TurfCard';

const TurfExplorer = ({ searchTerm, selectedSport }) => {
  const dispatch = useDispatch();
  const { turfs, loading, total, pages } = useSelector((state) => state.turf);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSport]);

  useEffect(() => {
    dispatch(fetchTurfs({
      page: currentPage,
      limit: 6,
      category: selectedSport === 'All' ? '' : selectedSport,
      location: searchTerm,
    }));
  }, [dispatch, currentPage, selectedSport, searchTerm]);

  return (
    <div>
      {/* Result header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic">Premium Results</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{total} Arenas Active Now</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Availability Tracking</span>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-[#1A1D23] rounded-3xl h-96 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : turfs.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="inline-flex p-4 bg-gray-900 rounded-full border border-gray-800 text-gray-600 mb-4">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">No Fields Detected</h3>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {turfs.map((turf) => (
              <TurfCard key={turf._id} turf={turf} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-[#1A1D23] border border-gray-800 rounded-xl text-gray-400 hover:text-[#39FF14] disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'bg-gray-900 text-gray-500 hover:bg-gray-800'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
                disabled={currentPage === pages}
                className="p-3 bg-[#1A1D23] border border-gray-800 rounded-xl text-gray-400 hover:text-[#39FF14] disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TurfExplorer;
