// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const acceptRejectBuddyRequest = createAsyncThunk(
    'acceptRejectBuddyRequest/acceptRejectBuddyRequest',
    async (acceptRejectPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('PATCH', '/requests/actions/user', acceptRejectPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const acceptRejectBuddyRequestSlice = createSlice({
    name: 'acceptRejectBuddyRequest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(acceptRejectBuddyRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptRejectBuddyRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(acceptRejectBuddyRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default acceptRejectBuddyRequestSlice.reducer;
