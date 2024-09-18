// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Import Axios

const initialState = {
    address: null,
    loading: false,
    error: null,
};

export const getAddressByLatLong = createAsyncThunk(
    'getAddress/getAddressByLatLong',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    format: 'json',
                    lat: payload?.lat,
                    lon: payload?.long,
                    'accept-language': 'en'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    }
);

const getAddressByLatLongSlice = createSlice({
    name: 'getAddress',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAddressByLatLong.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAddressByLatLong.fulfilled, (state, action) => {
                state.loading = false;
                state.address = action.payload?.address;
            })
            .addCase(getAddressByLatLong.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAddressByLatLongSlice.reducer;
