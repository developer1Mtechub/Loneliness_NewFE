// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const changePassword = createAsyncThunk(
    'changePassword/changePassword',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/auth/change-password', payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default changePasswordSlice.reducer;
