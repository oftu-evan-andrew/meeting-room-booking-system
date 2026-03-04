import { BookingForm } from '@/components/bookings/BookingForm';
import { RoomImageGallery } from '@/components/rooms/RoomImageGallery';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { parseAmenities } from '@/lib/utils';
import type { CreateBookingDto, RoomDetails } from '@/types';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarPlus, CheckCircle2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoomDetailPageProps {
  room: RoomDetails | null;
  loading?: boolean;
  error?: string | null;
  bookingLoading?: boolean;
  onBook: (data: CreateBookingDto) => void;
}

export function RoomDetailPage({ room, loading, error, bookingLoading, onBook }: RoomDetailPageProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-4xl animate-fade-in">
        <Skeleton className="h-4 w-24 mb-6" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div>
            <Skeleton className="h-72 w-full rounded-2xl mb-6" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40 mb-6" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
          </div>
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-lg font-medium text-slate-700">
          {error ?? 'Room not found'}
        </p>
        <button onClick={() => navigate('/rooms')} className="text-sm text-gold-600 mt-2 hover:underline">
          ← Back to rooms
        </button>
      </div>
    );
  }

  const amenities = parseAmenities(room.amenities);
  const bookingsCount = room.bookingId?.length ?? [];
  
  console.log(room);
  console.log("Keys on room object:", Object.keys(room));
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl"
    >
      <button
        onClick={() => navigate('/rooms')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Rooms
      </button>

      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        {/* Left */}
        <div>
          <RoomImageGallery imageUrls={room.imageUrls} roomName={room.name} />

          <div className="mt-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="font-display text-3xl font-semibold text-slate-900">{room.name}</h1>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700 shrink-0">
                <Users className="w-4 h-4" />
                {room.capacity} people
              </div>
            </div>

            {amenities.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Amenities</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center gap-2">
              <Badge variant={bookingsCount === 0 ? 'success' : 'gold'}>
                {bookingsCount === 0 ? 'Available' : `${bookingsCount} booking(s)`}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right — booking panel */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <CalendarPlus className="w-5 h-5 text-gold-500" />
              <h3 className="font-display text-lg font-semibold text-slate-900">Book this Room</h3>
            </div>
            <BookingForm roomId={room.id} onSubmit={onBook} loading={bookingLoading} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
