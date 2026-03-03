import { ApiResponse, AuthState, LoginCredentials, RegisterUserDto, User } from '@/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState: AuthState = {
    user: null, 
    isAuthenticated: false, 
    loading: true,
    error: null,
    successMessage: null,
    initialLoading: true
};

// --- Thunks ---

// If registration only returns a message, we keep ApiResponse
export const register = createAsyncThunk<ApiResponse, RegisterUserDto, { rejectValue: string }>(
    'auth/register', 
    async (userData, { rejectWithValue }) => { 
        try { 
            const response = await api.post<ApiResponse>('auth/register', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Registration failed');
        }
    }
);

// Changed return type to User (assuming your login API returns the user data)
export const login = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
    'auth/login', 
    async (credentials, { rejectWithValue }) => { 
        try { 
            const response = await api.post<User>('auth/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Login failed');
        }
    }
);

export const getProfile = createAsyncThunk<User, void, { rejectValue :string}>(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try { 
            const response = await api.get<User>('auth/profile');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ?? 'Session expired');
        }
    }
) 

export const logout = createAsyncThunk<ApiResponse, void, { rejectValue: string }>(
    'auth/logout',
    async (_, { rejectWithValue }) => { 
        try { 
            const response = await api.post<ApiResponse>('auth/logout');
            return response.data;
        } catch (error: any) { 
            return rejectWithValue(error.response?.data?.message ?? "Logout failed");
        }
    }
);

// --- Slice ---

const authSlice = createSlice({
    name: 'auth', 
    initialState, 
    reducers: { 
        clearMessage(state) {
            state.error = null; 
            state.successMessage = null;
            state.initialLoading = false;
        }, 
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload; 
            state.isAuthenticated = true; 
            state.initialLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login Handling
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.isAuthenticated = true;
                // Now action.payload IS the User object itself
                state.user = action.payload; 
                state.successMessage = "Welcome back!";
                state.initialLoading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.initialLoading = false;
            })
            
            // Session validation 
            .addCase(getProfile.pending, (state) => { 
                state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => { 
                state.loading = false;
                state.initialLoading = false
                state.isAuthenticated = true; 
                state.user = action.payload;
            })

            .addCase(getProfile.rejected, (state) => { 
                state.loading = false; 
                state.initialLoading = false
                state.isAuthenticated = false;
                state.user = null;
            })
            
            // Register Handling
            .addCase(register.fulfilled, (state, action) => {
                state.successMessage = action.payload.message ?? null; // Uses ApiResponse message
            })

            // Logout Handling
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.successMessage = "Logged out successfully";
            });
    }
});

export const { clearMessage, setUser } = authSlice.actions;
export default authSlice.reducer;