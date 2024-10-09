import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const cancelService = createAsyncThunk(
    'cancelService/cancelService',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/requests/cancel-meeting', payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const cancelServiceSlice = createSlice({
    name: 'cancelService',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(cancelService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelService.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(cancelService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default cancelServiceSlice.reducer;
