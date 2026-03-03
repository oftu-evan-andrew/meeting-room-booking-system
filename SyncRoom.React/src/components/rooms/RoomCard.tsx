import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowRight, ImageOff } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { parseAmenities } from '@/lib/utils';
import type { RoomSummary } from '@/types';

export function RoomCard({ room, index = 0 }: { room: RoomSummary; index?: number }) {
  const navigate = useNavigate();
  const amenities = parseAmenities(room.amenities);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card overflow-hidden group cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
      onClick={() => navigate(`/rooms/${room.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {room.imageUrls[0] ? (
          <img
            src={room.imageUrls[0]}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          <Users className="w-3.5 h-3.5" />
          {room.capacity}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-slate-900 leading-snug mb-3 group-hover:text-gold-600 transition-colors">
          {room.name}
        </h3>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.slice(0, 4).map((a) => (
              <Badge key={a} variant="muted">{a}</Badge>
            ))}
            {amenities.length > 4 && <Badge variant="muted">+{amenities.length - 4}</Badge>}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-800 transition-all duration-200"
          onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${room.id}`); }}
        >
          View & Book <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
