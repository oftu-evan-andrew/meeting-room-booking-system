import type { Toast, ToastType } from '@/hooks/useToast';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  error:   <XCircle     className="w-4 h-4 text-red-500 shrink-0" />,
  info:    <Info        className="w-4 h-4 text-blue-500 shrink-0" />,
};

const bars: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  info:    'bg-blue-500',
};

interface Props {
  toasts: Toast[];
  dismiss: (id: number) => void;
}

export function Toaster({ toasts, dismiss }: Props) {
  return createPortal(
    <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{   opacity: 0, x: 40,  scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl shadow-lg border border-slate-100 p-4 flex items-start gap-3 overflow-hidden"
          >
            {/* colour bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${bars[t.type]}`} />
            {icons[t.type]}
            <p className="text-sm text-slate-700 flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}