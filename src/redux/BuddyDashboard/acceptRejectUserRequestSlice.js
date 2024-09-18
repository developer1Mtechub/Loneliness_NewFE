// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const acceptRejectUserRequest = createAsyncThunk(
    'acceptRejectUserRequest/acceptRejectUserRequest',
    async (acceptRejectPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            // const data = await makeRequest('PATCH', '/requests/actions/buddy', acceptRejectPayload, null, bearerToken);
            const data = await makeRequest('PATCH', '/requests/actionsv2/buddy', acceptRejectPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const acceptRejectUserRequestSlice = createSlice({
    name: 'acceptRejectUserRequest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(acceptRejectUserRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptRejectUserRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(acceptRejectUserRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default acceptRejectUserRequestSlice.reducer;
