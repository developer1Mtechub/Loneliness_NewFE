// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const attachPaymentMethod = createAsyncThunk(
    'attachPaymentMethod/attachPaymentMethod',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('POST', '/payments/stripe/attach-payment-method', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const attachPaymentMethodSlice = createSlice({
    name: 'attachPaymentMethod',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(attachPaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(attachPaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result?.data;
            })
            .addCase(attachPaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default attachPaymentMethodSlice.reducer;
