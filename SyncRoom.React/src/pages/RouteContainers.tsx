/**
 * Route containers — these are the thin wrappers that sit between your
 * Redux store and the pure UI page components.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Toaster } from '@/components/ui/Toaster';
import { useToast } from '@/hooks/useToast';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RoomDetailPage } from '@/pages/RoomDetailPage';
import { RoomsPage } from '@/pages/RoomsPage';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, register } from '@/store/slices/authSlice';
import { createBooking, type CreateBookingPayload } from '@/store/slices/bookingSlice';
import {
  clearSelectedRoom,
  createRoom,
  deleteRoom,
  fetchAllRooms,
  fetchRoomById,
  updateRoom,
} from '@/store/slices/roomSlice';
import type { RoomDetails } from '@/types';

// ─── Login ────────────────────────────────────────────────────────────────────

export function LoginRoute() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = (data: { username: string; password: string }) => {
    dispatch(login(data))
      .unwrap()
      .then(() => navigate('/rooms'))
      .catch(() => {});
  };

  return <LoginPage onSubmit={handleLogin} loading={loading} error={error} />;
}

// ─── Register ─────────────────────────────────────────────────────────────────

export function RegisterRoute() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleRegister = (data: {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
  }) => {
    dispatch(register(data))
      .unwrap()
      .then(() => navigate('/login'))
      .catch(() => {});
  };

  return <RegisterPage onSubmit={handleRegister} loading={loading} error={error} />;
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

export function RoomsRoute() {
  const dispatch = useAppDispatch();
  const { rooms, loading, error } = useAppSelector((state) => state.rooms);

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  return <RoomsPage rooms={rooms} loading={loading} error={error} />;
}

// ─── Room Detail ──────────────────────────────────────────────────────────────

export function RoomDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedRoom, loading, error } = useAppSelector((state) => state.rooms);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { toasts, show, dismiss } = useToast();

  useEffect(() => {
    if (id) dispatch(fetchRoomById(id));
    return () => { dispatch(clearSelectedRoom()); };
  }, [id, dispatch]);

  const handleBook = (data: CreateBookingPayload) => {
    setBookingLoading(true);
    dispatch(createBooking(data))
      .unwrap()
      .then(() => {
        show('Booking created successfully!', 'success');
        // Re-fetch room so booking count updates
        if (id) dispatch(fetchRoomById(id));
      })
      .catch((err: string) => {
        show(err ?? 'Failed to create booking', 'error');
      })
      .finally(() => setBookingLoading(false));
  };

  return (
    <>
      <Toaster toasts={toasts} dismiss={dismiss} />
      <RoomDetailPage
        room={selectedRoom}
        loading={loading}
        error={error}
        bookingLoading={bookingLoading}
        onBook={handleBook}
      />
    </>
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function AdminRoute() {
  const dispatch = useAppDispatch();
  const { rooms, loading, selectedRoom } = useAppSelector((state) => state.rooms);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  const getRoomDetails = (id: string): RoomDetails | undefined => {
    if (selectedRoom?.id === id) return selectedRoom;
    dispatch(fetchRoomById(id));
    return undefined;
  };

  const withActionLoading = (thunk: Promise<any>) => {
    setActionLoading(true);
    return thunk.finally(() => setActionLoading(false));
  };

  return (
    <AdminPage
      rooms={rooms}
      loading={loading}
      actionLoading={actionLoading}
      onCreateRoom={(data) => withActionLoading(dispatch(createRoom(data)).unwrap())}
      onEditRoom={(id, data) => withActionLoading(dispatch(updateRoom({ id, ...data })).unwrap())}
      onDeleteRoom={(id) => withActionLoading(dispatch(deleteRoom(id)).unwrap())}
      getRoomDetails={getRoomDetails}
    />
  );
} 