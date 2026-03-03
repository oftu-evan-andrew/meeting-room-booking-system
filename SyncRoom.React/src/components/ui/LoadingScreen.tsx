import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">

      {/* Pulsating background rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-slate-100"
          initial={{ width: 80, height: 80, opacity: 0.6 }}
          animate={{ width: 80 + i * 100, height: 80 + i * 100, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Logo mark */}
      <motion.div
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center shadow-lg mb-6"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Building2 className="w-6 h-6 text-white" />
      </motion.div>

      {/* Wordmark */}
      <motion.p
        className="font-display text-xl font-semibold text-slate-800 tracking-tight"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        Sync<span className="text-gold-500">Room</span>
      </motion.p>

      {/* Subtle label */}
      <motion.p
        className="text-xs text-slate-300 mt-2 tracking-widest uppercase font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Loading
      </motion.p>

    </div>
  );
}