import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

export function RoomImageGallery({ imageUrls, roomName }: { imageUrls: string[]; roomName: string }) {
  const [current, setCurrent] = useState(0);

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-72 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3 text-slate-300">
        <ImageOff className="w-12 h-12" />
        <span className="text-sm">No images available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={imageUrls[current]}
          alt={`${roomName} — photo ${current + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>

      {imageUrls.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + imageUrls.length) % imageUrls.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % imageUrls.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center text-slate-700 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imageUrls.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? 'bg-white w-4' : 'bg-white/60 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
