// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const requestBackBuddy = createAsyncThunk(
    'requestBackBuddy/requestBackBuddy',
    async (requestBackPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/requests/request-back/buddy', requestBackPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const requestBackBuddySlice = createSlice({
    name: 'requestBackBuddy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(requestBackBuddy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestBackBuddy.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(requestBackBuddy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default requestBackBuddySlice.reducer;
