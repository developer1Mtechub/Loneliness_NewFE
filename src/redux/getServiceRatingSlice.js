// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    ratingDetail: null,
    loading: false,
    error: null,
};

export const getServiceRating = createAsyncThunk(
    'getServiceRating/getServiceRating',
    async (requestId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('GET', `/rating/get/${requestId}/service`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getServiceRatingSlice = createSlice({
    name: 'getServiceRating',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServiceRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getServiceRating.fulfilled, (state, action) => {
                state.loading = false;
                state.ratingDetail = action.payload?.result;
            })
            .addCase(getServiceRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getServiceRatingSlice.reducer;
