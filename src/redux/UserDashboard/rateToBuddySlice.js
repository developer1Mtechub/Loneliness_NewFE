// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const rateToBuddy = createAsyncThunk(
    'rateToBuddy/rateToBuddy',
    async ({ payload, addRate }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const requestMethod = addRate ? 'POST' : 'PUT';
            const endpoint = addRate ? '/rating/add' : '/rating/update';
            const data = await makeRequest(requestMethod, endpoint, payload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const rateToBuddySlice = createSlice({
    name: 'rateToBuddy',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(rateToBuddy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rateToBuddy.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(rateToBuddy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default rateToBuddySlice.reducer;
