import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const fetchTurfs = createAsyncThunk(
  'turf/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await API.get('/turfs/all', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchTurfById = createAsyncThunk(
  'turf/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/turfs/${id}`);
      return response.data.turf;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOwnerTurfs = createAsyncThunk(
  'turf/fetchOwnerTurfs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/turfs/owner');
      return response.data.turfs;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOwnerTurf = createAsyncThunk(
  'turf/updateOwnerTurf',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/turfs/${id}`, data);
      return response.data.turf;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOwnerTurf = createAsyncThunk(
  'turf/deleteOwnerTurf',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/turfs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  turfs: [],
  ownerTurfs: [],
  selectedTurf: null,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  ownerTurfsLoading: false,
  error: null,
};

const turfSlice = createSlice({
  name: 'turf',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTurfs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTurfs.fulfilled, (state, action) => {
        state.loading = false;
        state.turfs = action.payload.turfs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchTurfs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTurfById.fulfilled, (state, action) => {
        state.selectedTurf = action.payload;
      })
      // Owner turf management
      .addCase(fetchOwnerTurfs.pending, (state) => {
        state.ownerTurfsLoading = true;
      })
      .addCase(fetchOwnerTurfs.fulfilled, (state, action) => {
        state.ownerTurfsLoading = false;
        state.ownerTurfs = action.payload;
      })
      .addCase(fetchOwnerTurfs.rejected, (state) => {
        state.ownerTurfsLoading = false;
      })
      .addCase(updateOwnerTurf.fulfilled, (state, action) => {
        const idx = state.ownerTurfs.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.ownerTurfs[idx] = action.payload;
      })
      .addCase(deleteOwnerTurf.fulfilled, (state, action) => {
        state.ownerTurfs = state.ownerTurfs.filter(t => t._id !== action.payload);
      });
  },
});

export default turfSlice.reducer;
