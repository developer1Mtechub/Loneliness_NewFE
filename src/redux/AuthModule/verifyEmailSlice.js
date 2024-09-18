// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const verifyEmail = createAsyncThunk(
    'verifyEmail/verifyEmail',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', '/auth/forgot-password', payload);
            return data;
        } catch (error) {
            return error
        }
    }
);

const verifyEmailSlice = createSlice({
    name: 'verifyEmail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default verifyEmailSlice.reducer;
