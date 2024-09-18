// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const checkChatPayment = createAsyncThunk(
    'checkChatPayment/checkChatPayment',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('POST', '/payments/services/chat-payment/status', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const checkChatPaymentSlice = createSlice({
    name: 'checkChatPayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkChatPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkChatPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(checkChatPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkChatPaymentSlice.reducer;
