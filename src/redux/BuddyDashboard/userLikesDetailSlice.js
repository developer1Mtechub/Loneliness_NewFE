// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/users/get/";

const initialState = {
    userDetail: null,
    loading: false,
    error: null,
};

export const getUserDetail = createAsyncThunk(
    'getUserDetail/getUserDetail',
    async (userId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('GET', `${baseEndpoint}${userId}`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const userLikesDetailSlice = createSlice({
    name: 'getUserDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetail = action.payload?.result;
            })
            .addCase(getUserDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userLikesDetailSlice.reducer;
