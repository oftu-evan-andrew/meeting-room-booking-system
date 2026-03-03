import { cn, getInitials } from '@/lib/utils';

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

export function Avatar({ firstName, lastName, size = 'md', className }: {
  firstName: string; lastName: string; size?: 'sm' | 'md' | 'lg'; className?: string;
}) {
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-semibold',
      'flex items-center justify-center shrink-0 select-none',
      sizes[size], className
    )}>
      {getInitials(firstName, lastName)}
    </div>
  );
}
