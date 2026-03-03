import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { parseAmenities } from '@/lib/utils';
import type { RoomDetails } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Room name is required'),
  capacity: z.coerce.number().min(1, 'Must be at least 1'),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomDetails;
  onSubmit: (data: { name: string; capacity: number; amenities: string[]; existingImageUrls: string[]; newImageFiles: File[] }) => void;
  loading?: boolean;
}

export function EditRoomModal({ open, onOpenChange, room, onSubmit, loading }: Props) {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({ name: room.name, capacity: room.capacity });
      setAmenities(parseAmenities(room.amenities));
      setExistingImages([...room.imageUrls]);
      setNewFiles([]);
      setNewPreviews([]);
    }
  }, [open, room, reset]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setNewFiles((p) => [...p, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewPreviews((p) => [...p, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const submit = (data: FormValues) => {
    onSubmit({ name: data.name, capacity: data.capacity, amenities, existingImageUrls: existingImages, newImageFiles: newFiles });
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal — centered */}
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: '42rem', maxHeight: '90vh',
          overflowY: 'auto', backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          zIndex: 10000,
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-900">Edit Room</h2>
            <button onClick={() => onOpenChange(false)} className="rounded-lg p-1 hover:bg-gray-100 transition-colors" type="button">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Editing: {room.name}</p>

          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Room Name" error={errors.name?.message} {...register('name')} />
              <Input label="Capacity" type="number" error={errors.capacity?.message} {...register('capacity')} />
            </div>

            {/* Amenities */}
            <div>
              <label className="label">Amenities</label>
              <div className="flex flex-wrap gap-2 mb-2.5 min-h-[28px]">
                {amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    {a}
                    <button type="button" onClick={() => setAmenities((p) => p.filter((x) => x !== a))} className="text-slate-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1 text-sm"
                  placeholder="Add amenity…"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newAmenity.trim();
                      if (val && !amenities.includes(val)) { setAmenities((p) => [...p, val]); setNewAmenity(''); }
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const val = newAmenity.trim();
                  if (val && !amenities.includes(val)) { setAmenities((p) => [...p, val]); setNewAmenity(''); }
                }}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </div>
            </div>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div>
                <label className="label">Current Images</label>
                <div className="grid grid-cols-5 gap-2">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingImages((p) => p.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New images */}
            <div>
              <label className="label">Add New Images</label>
              <div
                className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-gold-400 hover:bg-gold-50/30 transition-colors"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              >
                <Upload className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="text-xs text-slate-400">Click or drag to add photos</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
              {newPreviews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {newPreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setNewFiles((p) => p.filter((_, idx) => idx !== i)); setNewPreviews((p) => p.filter((_, idx) => idx !== i)); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
              <Button type="submit" variant="gold" loading={loading} className="flex-1">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}