// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const cardWalletPaymentTransfer = createAsyncThunk(
    'cardWalletPaymentTransfer/cardWalletPaymentTransfer',
    async (paymentPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/payments/services/transfer-payment', paymentPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const cardWalletPaymentTransferSlice = createSlice({
    name: 'cardWalletPaymentTransfer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(cardWalletPaymentTransfer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cardWalletPaymentTransfer.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(cardWalletPaymentTransfer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cardWalletPaymentTransferSlice.reducer;
