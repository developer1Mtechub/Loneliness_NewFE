// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/requests/getAll/buddy";

const initialState = {
    requests: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const getAllBuddyRequest = createAsyncThunk(
    'getAllBuddyRequest/getAllBuddyRequest',
    async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const bearerToken = `Bearer ${token}`;
            const data = await makeRequest('GET', `${baseEndpoint}?page=${page}&limit=${limit}`, null, null, bearerToken);
            return data;
        } catch (error) {
            console.log('error',error)
            return error
        }
    }
);

const getAllBuddyRequestSlice = createSlice({
    name: 'getAllBuddyRequest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllBuddyRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBuddyRequest.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.requests = action.payload.result?.data;
                } else {
                    state.requests = [...state.requests, ...action.payload.result?.data];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.totalPages;
            })
            .addCase(getAllBuddyRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllBuddyRequestSlice.reducer;
