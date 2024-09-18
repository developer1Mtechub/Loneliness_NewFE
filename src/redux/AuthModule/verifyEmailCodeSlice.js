// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const verifyEmailCode = createAsyncThunk(
    'verifyEmailCode/verifyEmailCode',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', '/auth/verify-code', payload);
            return data;
        } catch (error) {
            return error
        }
    }
);

const verifyEmailCodeSlice = createSlice({
    name: 'verifyEmailCode',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyEmailCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmailCode.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(verifyEmailCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default verifyEmailCodeSlice.reducer;
