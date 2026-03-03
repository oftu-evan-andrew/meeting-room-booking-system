import { RoomDetails, RoomSummary } from '@/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface RoomState { 
    rooms: RoomSummary[];
    selectedRoom: RoomDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: RoomState = { 
    rooms: [], selectedRoom: null, loading: false, error: null
};

export interface CreateRoomPayload {
    name: string;
    capacity: number;
    amenities: string[];
    imageFiles: File[];
}

export interface UpdateRoomPayload {
    id: string;
    name: string;
    capacity: number;
    amenities: string[];
    existingImageUrls: string[];
    newImageFiles: File[];
}

const toCreateFormData = (data: CreateRoomPayload): FormData => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Capacity', String(data.capacity));
    (data.amenities ?? []).forEach((a) => formData.append('Amenities', a));
    (data.imageFiles ?? []).forEach((f) => formData.append('ImageFiles', f));
    return formData;
};

const toEditFormData = (data: Omit<UpdateRoomPayload, 'id'>): FormData => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Capacity', String(data.capacity));
    (data.amenities ?? []).forEach((a) => formData.append('Amenities', a));
    (data.existingImageUrls ?? []).forEach((url) => formData.append('ExistingImageUrls', url));
    (data.newImageFiles ?? []).forEach((f) => formData.append('ImageFiles', f));
    return formData;
};

export const fetchAllRooms = createAsyncThunk<RoomSummary[]>(
    'room/fetchAll',
    async(_, { rejectWithValue }) => { 
        try { 
            const { data } = await api.get<RoomSummary[]>('/room');
            return data; 
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Room not found');
        }
    }
);

export const fetchRoomById = createAsyncThunk<RoomDetails, string>(
    'rooms/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get<RoomDetails>(`/room/${id}`);
            return data;
        } catch (e: any) {
            return rejectWithValue(e.response?.data?.message ?? 'Room not found');
        }
    }
);

export const createRoom = createAsyncThunk<RoomSummary, CreateRoomPayload>(
    'room/create',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await api.post<RoomSummary>('/room/create', toCreateFormData(payload), {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Failed to create room');
        }
    }
);

export const updateRoom = createAsyncThunk<void, UpdateRoomPayload>(
    'rooms/update',
    async ({ id, ...rest }, { rejectWithValue }) => { 
        try { 
            await api.put(`room/${id}`, toEditFormData(rest), { 
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? "Failed to update room");
        }
    }
);

export const deleteRoom = createAsyncThunk<string, string>(
    'rooms/delete',
    async (id, { rejectWithValue }) => { 
        try { 
            await api.delete(`/room/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Failed to delete room');
        }
    }
);

const roomSlice = createSlice({ 
    name: 'rooms',
    initialState, 
    reducers: { clearSelectedRoom(state) { state.selectedRoom = null } },
    extraReducers: builder => {
        builder
            .addCase(createRoom.fulfilled, (s, { payload }) => { s.rooms.push(payload); })
            .addCase(fetchAllRooms.pending, s => { s.loading = true; s.error = null; })
            .addCase(fetchAllRooms.fulfilled, (s, { payload }) => { s.loading = false; s.rooms = payload; })
            .addCase(fetchAllRooms.rejected, (s, { payload }) => { s.loading = false; s.error = payload as string; })
            .addCase(fetchRoomById.fulfilled, (s, { payload }) => { s.selectedRoom = payload; })
            .addCase(deleteRoom.fulfilled, (s, { payload }) => { s.rooms = s.rooms.filter(r => r.id !== payload); });
    },
});

export const { clearSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;