// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const verifyMeetingCode = createAsyncThunk(
    'verifyMeetingCode/verifyMeetingCode',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/requests/verify-meeting-code', payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const verifyMeetingCodeSlice = createSlice({
    name: 'verifyMeetingCode',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(verifyMeetingCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyMeetingCode.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(verifyMeetingCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default verifyMeetingCodeSlice.reducer;
