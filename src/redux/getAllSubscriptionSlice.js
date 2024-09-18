// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    subscription: [],
    loading: false,
    error: null,
};

export const getAllSubscription = createAsyncThunk(
    'getSubscription/getAllSubscription',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('GET', '/subscription/get-all', null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllSubscriptionSlice = createSlice({
    name: 'getSubscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSubscription.fulfilled, (state, action) => {
                state.loading = false;
                state.subscription = action.payload?.result?.data;
            })
            .addCase(getAllSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllSubscriptionSlice.reducer;
