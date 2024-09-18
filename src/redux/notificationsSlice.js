// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    notifications: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1
};

export const getNotifications = createAsyncThunk(
    'notifications/getNotifications',
    async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('GET', `/notifications/get-all?page=${page}&limit=${limit}`, null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.notifications = action.payload.result?.data;
                } else {
                    state.notifications = [...state.notifications, ...action.payload.result?.data];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.pagination?.total;
                state.totalCount = action.payload.result?.pagination?.total;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default notificationsSlice.reducer;
