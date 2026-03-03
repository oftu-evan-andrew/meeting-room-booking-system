import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Variant = 'default' | 'gold' | 'success' | 'danger' | 'muted';

const variants: Record<Variant, string> = {
  default: 'bg-slate-100 text-slate-700',
  gold:    'bg-gold-100 text-gold-700',
  success: 'bg-emerald-50 text-emerald-700',
  danger:  'bg-red-50 text-red-700',
  muted:   'bg-slate-50 text-slate-400',
};

export function Badge({ variant = 'default', children, className }: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
