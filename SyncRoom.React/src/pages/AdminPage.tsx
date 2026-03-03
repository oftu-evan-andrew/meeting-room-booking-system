import { CreateRoomModal } from '@/components/admin/CreateRoomModal';
import { EditRoomModal } from '@/components/admin/EditRoomModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { parseAmenities } from '@/lib/utils';
import type { RoomDetails, RoomSummary } from '@/types';
import { motion } from 'framer-motion';
import { ImageOff, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface AdminPageProps {
  rooms: RoomSummary[];
  loading?: boolean;
  actionLoading?: boolean;
  onCreateRoom: (data: { name: string; capacity: number; amenities: string[]; imageFiles: File[] }) => void;
  onEditRoom: (id: string, data: { name: string; capacity: number; amenities: string[]; existingImageUrls: string[]; newImageFiles: File[] }) => void;
  onDeleteRoom: (id: string) => void;
  getRoomDetails: (id: string) => RoomDetails | undefined;
}

export function AdminPage({ rooms, loading, actionLoading, onCreateRoom, onEditRoom, onDeleteRoom, getRoomDetails }: AdminPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomDetails | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    const details = getRoomDetails(id);
    if (details) setEditRoom(details);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-gold-500" />
            <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest">Admin Panel</p>
          </div>
          <h1 className="page-title">Room Management</h1>
          <p className="page-subtitle">Create, edit, or deactivate workspace rooms.</p>
        </div>
        <Button variant="gold" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Rooms', value: rooms.length, accent: 'bg-slate-800' },
          { label: 'Active Rooms', value: rooms.length, accent: 'bg-emerald-600' },
          { label: 'Total Capacity', value: rooms.reduce((s, r) => s + r.capacity, 0), accent: 'bg-gold-500' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-1.5 h-10 rounded-full ${stat.accent}`} />
            <div>
              <p className="text-2xl font-bold font-display text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">All Rooms</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-slate-400 text-sm">No rooms created yet. Click "New Room" to get started.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Room</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Capacity</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">Amenities</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rooms.map((room, i) => {
                const amenities = parseAmenities(room.amenities);
                return (
                  <motion.tr
                    key={room.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {room.imageUrls[0] ? (
                            <img src={room.imageUrls[0]} alt={room.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-4 h-4 text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-800">{room.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{room.id.slice(0, 12)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Users className="w-3.5 h-3.5 text-slate-400" />{room.capacity}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {amenities.slice(0, 3).map((a) => <Badge key={a} variant="muted">{a}</Badge>)}
                        {amenities.length > 3 && <Badge variant="muted">+{amenities.length - 3}</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(room.id)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeleteId(room.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreateRoomModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) => { onCreateRoom(data); setCreateOpen(false); }}
        loading={actionLoading}
      />

      {editRoom && (
        <EditRoomModal
          open={!!editRoom}
          onOpenChange={(o) => !o && setEditRoom(null)}
          room={editRoom}
          onSubmit={(data) => { onEditRoom(editRoom.id, data); setEditRoom(null); }}
          loading={actionLoading}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Deactivate Room"
        description="This room will be marked as deleted and hidden from all users."
        confirmLabel="Deactivate"
        onConfirm={() => { if (deleteId) { onDeleteRoom(deleteId); setDeleteId(null); } }}
        loading={actionLoading}
      />
    </div>
  );
}
