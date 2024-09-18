// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const resetPassword = createAsyncThunk(
    'resetPassword/resetPassword',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await makeRequest('POST', '/auth/reset-password', payload);
            return data;
        } catch (error) {
            return error
        }
    }
);

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default resetPasswordSlice.reducer;
