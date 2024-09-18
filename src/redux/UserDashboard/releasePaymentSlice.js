// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const releasePayment = createAsyncThunk(
    'releasePayment/releasePayment',
    async (paymentPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/payments/services/release-payment', paymentPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const releasePaymentSlice = createSlice({
    name: 'releasePayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(releasePayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(releasePayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(releasePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default releasePaymentSlice.reducer;
