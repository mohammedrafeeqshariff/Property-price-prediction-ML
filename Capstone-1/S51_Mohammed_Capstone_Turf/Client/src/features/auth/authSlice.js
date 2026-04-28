import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';
import { account } from '../../components/appwriteConfig';

// Async Thunk for Login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Clear any existing session first to avoid conflicts
      try {
        await account.deleteSession('current');
      } catch (e) {
        // No active session or unknown error, safe to proceed
      }

      // 1. Appwrite Login
      await account.createEmailPasswordSession(email, password);
      const appwriteUser = await account.get();
      
      // 2. Get JWT from Appwrite (if needed for backend verification)
      const jwtResponse = await account.createJWT();
      const token = jwtResponse.jwt;

      // 3. Sync with MongoDB
      const response = await API.post('/auth/sync', {
        appwriteId: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('token', token);
      return { user: response.data.user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk for Signup
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name, role }, { rejectWithValue }) => {
    try {
      // Clear any existing session first
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore
      }

      // 1. Appwrite Signup
      await account.create('unique()', email, password, name);
      await account.createEmailPasswordSession(email, password);
      const appwriteUser = await account.get();
      
      const jwtResponse = await account.createJWT();
      const token = jwtResponse.jwt;

      // 2. Sync with MongoDB
      const response = await API.post('/auth/sync', {
        appwriteId: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        role: role || 'user'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('token', token);
      return { user: response.data.user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk for Profile Update
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put('/auth/profile', profileData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await account.deleteSession('current');
  localStorage.removeItem('token');
  return null;
});

const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
