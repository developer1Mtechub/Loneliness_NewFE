// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const checkStripeFilledStatus = createAsyncThunk(
    'checkStripeFilledStatus/checkStripeFilledStatus',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { bearerToken } = getState().bearerToken;
            const data = await makeRequest('POST', '/payments/connected-account/check-requirement/status', null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const checkStripeFilledStatusSlice = createSlice({
    name: 'checkStripeFilledStatus',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkStripeFilledStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkStripeFilledStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(checkStripeFilledStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkStripeFilledStatusSlice.reducer;
