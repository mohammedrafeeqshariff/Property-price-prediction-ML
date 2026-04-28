import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await API.post('/bookings/book', bookingData);
      return response.data.booking;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/bookings/my-bookings');
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOwnerBookings = createAsyncThunk(
  'booking/fetchOwner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/bookings/owner-bookings');
      return response.data.bookings;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAvailability = createAsyncThunk(
  'booking/fetchAvailability',
  async ({ turfId, date }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/bookings/availability/${turfId}?date=${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  bookings: [],
  availability: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.availability = action.payload.bookedSlots.map(b => b.start);
      });

  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
