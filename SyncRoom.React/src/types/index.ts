// types/index.ts
export interface User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email?: string;
    role: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
    amenities: string;
    imageUrls: string[];
}

export interface RoomSummary {
  id: string;
  name: string;
  capacity: number;
  amenities: string;
  imageUrls: string[];
}

export interface RoomDetails extends Room {
    bookingId?: string[]; // Booking IDs
}

export interface CreateRoomDto {
    name: string;
    capacity: number;
    amenities: string[];
}

export interface UpdateRoomDto {
    name: string;
    capacity: number;
    amenities: string[];
    existingImageUrls: string[];
}

export interface Booking {
    id: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    roomId: string;
    userId: string;
}

export interface CreateBookingDto {
    title: string;
    description?: string;
    roomId: string;
    startTime: string;
    endTime: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterUserDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface ApiResponse<T = any> {
    message?: string;
    data?: T;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    initialLoading: boolean
}

export interface RoomsState {
    rooms: Room[];
    currentRoom: RoomDetails | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    totalRooms: number;
}

export interface BookingsState {
    userBookings: Booking[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export interface RootState {
    auth: AuthState;
    rooms: RoomsState;
    bookings: BookingsState;
}