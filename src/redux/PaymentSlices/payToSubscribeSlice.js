// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const payToSubscribe = createAsyncThunk(
    'payToSubscribe/payToSubscribe',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('POST', '/payments/subscription/subscribe', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const payToSubscribeSlice = createSlice({
    name: 'payToSubscribe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(payToSubscribe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payToSubscribe.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result?.data;
            })
            .addCase(payToSubscribe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default payToSubscribeSlice.reducer;
