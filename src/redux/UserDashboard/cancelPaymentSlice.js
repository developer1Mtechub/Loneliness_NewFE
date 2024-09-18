// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const cancelPayment = createAsyncThunk(
    'cancelPayment/cancelPayment',
    async (paymentPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/payments/services/cancel-payment/request', paymentPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const cancelPaymentSlice = createSlice({
    name: 'cancelPayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(cancelPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(cancelPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cancelPaymentSlice.reducer;
