import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomCardSkeleton } from '@/components/ui/Skeleton';
import type { RoomSummary } from '@/types';
import { motion } from 'framer-motion';
import { LayoutGrid, Search, SlidersHorizontal, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

type SortOption = 'name' | 'capacity-asc' | 'capacity-desc';

interface RoomsPageProps {
  rooms: RoomSummary[];
  loading?: boolean;
  error?: string | null;
}

export function RoomsPage({ rooms, loading, error }: RoomsPageProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name');
  const [capacityFilter, setCapacityFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = [...rooms];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.amenities.toLowerCase().includes(q)
      );
    }

    if (capacityFilter) result = result.filter((r) => r.capacity >= capacityFilter);

    switch (sort) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'capacity-asc': result.sort((a, b) => a.capacity - b.capacity); break;
      case 'capacity-desc': result.sort((a, b) => b.capacity - a.capacity); break;
    }

    return result;
  }, [rooms, search, sort, capacityFilter]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-2">Workspace</p>
          <h1 className="page-title">Meeting Rooms</h1>
          <p className="page-subtitle">Browse and reserve available spaces for your team.</p>
        </div>
        {!loading && rooms.length > 0 && (
          <p className="text-sm text-slate-400 pb-1">{filtered.length} of {rooms.length} rooms</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            className="input-field pl-10"
            placeholder="Search rooms or amenities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select className="input-field pl-9 pr-8 appearance-none min-w-[150px]"
              value={capacityFilter ?? ''}
              onChange={(e) => setCapacityFilter(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Any capacity</option>
              <option value="4">4+ people</option>
              <option value="8">8+ people</option>
              <option value="12">12+ people</option>
              <option value="20">20+ people</option>
            </select>
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select className="input-field pl-9 pr-8 appearance-none min-w-[160px]"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}>
              <option value="name">Sort: Name</option>
              <option value="capacity-asc">Capacity: Low → High</option>
              <option value="capacity-desc">Capacity: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="font-display text-lg font-medium text-slate-700">Failed to load rooms</p>
          <p className="text-sm text-slate-400 mt-1">{error}</p>
        </div>
      ) : rooms.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-display text-lg font-medium text-slate-700">No rooms yet</p>
          <p className="text-sm text-slate-400 mt-1">Rooms added by an admin will appear here.</p>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <p className="font-display text-lg font-medium text-slate-700">No rooms match your filters</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or capacity filter.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((room, i) => <RoomCard key={room.id} room={room} index={i} />)}
        </div>
      )}
    </div>
  );
}
