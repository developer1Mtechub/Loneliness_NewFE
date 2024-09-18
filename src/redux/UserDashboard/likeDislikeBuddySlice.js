// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const likeDislikeBuddy = createAsyncThunk(
    'likeDislikeBuddy/likeDislikeBuddy',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/users/buddy/like', payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const likeDislikeBuddySlice = createSlice({
    name: 'likeDislikeBuddy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(likeDislikeBuddy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(likeDislikeBuddy.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(likeDislikeBuddy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default likeDislikeBuddySlice.reducer;
