import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  onSubmit: (data: { name: string; capacity: number; amenities: string[]; imageFiles: File[] }) => void;
  loading?: boolean;
}

export function CreateRoomModal({ open, onOpenChange, onSubmit, loading }: Props) {
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityError, setAmenityError] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const addAmenity = () => {
    const val = newAmenity.trim();
    if (val && !amenities.includes(val)) {
      setAmenities((p) => [...p, val]);
      setAmenityError(null);
      setNewAmenity('');
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setImageFiles((p) => [...p, ...arr]);
    arr.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((p) => [...p, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const submit = (data: FormValues) => {
    if (amenities.length === 0) {
      setAmenityError('At least one amenity is required');
      return;
    }
    if (submitted) return;
    setSubmitted(true);
    onSubmit({ name: data.name, capacity: data.capacity, amenities, imageFiles });
    reset();
    setAmenities([]);
    setImageFiles([]);
    setPreviews([]);
  };

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setAmenityError(null);
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
        onClick={() => onOpenChange(false)}
      />
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
            <h2 className="text-xl font-semibold text-gray-900">Create New Room</h2>
            <button onClick={() => onOpenChange(false)} className="rounded-lg p-1 hover:bg-gray-100 transition-colors" type="button">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Add a new meeting room to the directory.</p>

          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ROOM NAME</label>
                <Input placeholder="e.g. The Boardroom" error={errors.name?.message} {...register('name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CAPACITY</label>
                <Input type="number" placeholder="10" error={errors.capacity?.message} {...register('capacity')} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                {amenities.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {a}
                    <button type="button" onClick={() => setAmenities((p) => p.filter((x) => x !== a))} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${amenityError ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="e.g. Wi-Fi, Projector..."
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                />
                <Button type="button" variant="outline" size="sm" onClick={addAmenity}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              {amenityError && <p className="mt-1.5 text-xs text-red-500">{amenityError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Images</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-colors"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600"><span className="text-blue-600 font-medium">Click to upload</span> or drag & drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
              <Button type="submit" variant="gold" loading={loading} className="flex-1">Create Room</Button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}