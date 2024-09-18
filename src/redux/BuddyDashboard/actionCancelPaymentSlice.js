// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const actionCancelPayment = createAsyncThunk(
    'actionCancelPayment/actionCancelPayment',
    async (paymentPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/payments/services/cancel-payment/actions', paymentPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const actionCancelPaymentSlice = createSlice({
    name: 'actionCancelPayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(actionCancelPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(actionCancelPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(actionCancelPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default actionCancelPaymentSlice.reducer;
