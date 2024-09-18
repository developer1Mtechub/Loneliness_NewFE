// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const requestForPayment = createAsyncThunk(
    'requestForPayment/requestForPayment',
    async (requestId, { getState, rejectWithValue }) => {
        try {
            const requestPayload = {
                request_id: requestId
            }
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/users/release-payment/request', requestPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const requestForPaymentSlice = createSlice({
    name: 'requestForPayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(requestForPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestForPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(requestForPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default requestForPaymentSlice.reducer;
