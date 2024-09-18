// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL_PAYMENT } from '@env'

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const cancelSubscription = createAsyncThunk(
    'cancelSubscription/cancelSubscription',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;

            const response = await fetch(`${API_BASE_URL_PAYMENT}/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.log('server error --> cancel subscription')
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
);

const cancelSubscriptionSlice = createSlice({
    name: 'cancelSubscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(cancelSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(cancelSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cancelSubscriptionSlice.reducer;
