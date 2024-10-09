// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    likeDislikes: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const getUserLikeDislike = createAsyncThunk(
    'getUserLikeDislike/getUserLikeDislike',
    async ({ page = 1, limit = 10, endpoint = 'get-likes' }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const bearerToken = `Bearer ${token}`;
            let url = `/users/${endpoint}/user?page=${page}&limit=${limit}`;
            const data = await makeRequest('GET', url, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllServiceRequestsSlice = createSlice({
    name: 'getUserLikeDislike',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserLikeDislike.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserLikeDislike.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.likeDislikes = action.payload.result?.data;
                } else {
                    state.likeDislikes = [...state.likeDislikes, ...action.payload.result?.data];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.totalPages;
            })
            .addCase(getUserLikeDislike.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllServiceRequestsSlice.reducer;
