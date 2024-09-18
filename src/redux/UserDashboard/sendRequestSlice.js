// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const sendRequest = createAsyncThunk(
    'sendRequest/sendRequest',
    async (requestPayload, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', '/requests/sendv2/user', requestPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const sendRequestSlice = createSlice({
    name: 'sendRequest',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(sendRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sendRequestSlice.reducer;
