// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/requests/getAll/user";

const initialState = {
    serviceRequests: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const getAllServiceRequests = createAsyncThunk(
    'getAllServiceRequests/getAllServiceRequests',
    async ({ page = 1, limit = 10, status = '' }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const bearerToken = `Bearer ${token}`;
            let url = `${baseEndpoint}?page=${page}&limit=${limit}`;
            if (status) {
                url += `&status=${status}`;
            }
            const data = await makeRequest('GET', url, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllServiceRequestsSlice = createSlice({
    name: 'getAllServiceRequests',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllServiceRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllServiceRequests.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.serviceRequests = action.payload.result?.data;
                } else {
                    state.serviceRequests = [...state.serviceRequests, ...action.payload.result?.data];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.totalPages;
            })
            .addCase(getAllServiceRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllServiceRequestsSlice.reducer;
