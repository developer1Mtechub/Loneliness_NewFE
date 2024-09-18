// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    notifications: null,
    loading: false,
    error: null,
};

export const getAllNotifications = createAsyncThunk(
    'getAllNotifications/getAllNotifications',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;
            const data = await makeRequest('GET', '/notifications/get-all', null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllNotificationsSlice = createSlice({
    name: 'getAllNotifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload?.result;
            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllNotificationsSlice.reducer;
