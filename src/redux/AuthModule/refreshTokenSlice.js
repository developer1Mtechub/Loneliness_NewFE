// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const refreshToken = createAsyncThunk(
    'refreshToken/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { userLoginInfo } = getState().auth
            const { refreshToken } = userLoginInfo
            const payload = {
                refresh_token: refreshToken
            }
            const data = await makeRequest('POST', `/auth/refresh-token`, payload, null, null);
            return data;
        } catch (error) {
            return error
        }
    }
);

const refreshTokenSlice = createSlice({
    name: 'refreshToken',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default refreshTokenSlice.reducer;
