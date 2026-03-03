import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { CreateBookingDto } from '@/types';

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
}).refine((d) => new Date(d.endTime) > new Date(d.startTime), {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type FormValues = z.infer<typeof schema>;

function toDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface BookingFormProps {
  roomId: string;
  onSubmit: (data: CreateBookingDto) => void;
  loading?: boolean;
}

export function BookingForm({ roomId, onSubmit, loading }: BookingFormProps) {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTime: toDateTimeLocal(now),
      endTime: toDateTimeLocal(later),
    },
  });

  const submit = (data: FormValues) => {
    onSubmit({
      ...data,
      roomId,
      startTime: new Date(data.startTime).toISOString(),
      endTime: new Date(data.endTime).toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input
        label="Booking Title"
        placeholder="e.g. Q2 Strategy Meeting"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="label">Description (optional)</label>
        <textarea
          className="input-field resize-none h-20"
          placeholder="Brief agenda or notes…"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Time"
          type="datetime-local"
          leftIcon={<CalendarDays className="w-4 h-4" />}
          error={errors.startTime?.message}
          {...register('startTime')}
        />
        <Input
          label="End Time"
          type="datetime-local"
          leftIcon={<Clock className="w-4 h-4" />}
          error={errors.endTime?.message}
          {...register('endTime')}
        />
      </div>

      <Button type="submit" variant="gold" loading={loading} className="w-full mt-2">
        Confirm Booking
      </Button>
    </form>
  );
}
