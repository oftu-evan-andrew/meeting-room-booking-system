import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface CreateBookingPayload { 
    title: string ;
    description?: string; 
    roomId: string; 
    startTime: string;
    endTime: string;
}

export const createBooking = createAsyncThunk<void, CreateBookingPayload>(
    'bookings/create',
    async (payload, { rejectWithValue }) => {
        try {
            await api.post('/booking/create', payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Bookings failed');
        }
    }
);

export const deleteBooking = createAsyncThunk<string, string>(
    'bookings/delete',
    async (id, { rejectWithValue }) => {
        try { 
            await api.delete(`/booking/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Booking deletion failed');
        }
    }
);
