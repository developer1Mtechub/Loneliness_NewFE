// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/requests/get/";

const initialState = {
    requestDetail: null,
    loading: false,
    error: null,
};

export const getRequestById = createAsyncThunk(
    'getRequestById/getRequestById',
    async (requestId, { getState, rejectWithValue }) => {
        try {
            console.log('requestId',requestId)
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('GET', `${baseEndpoint}${requestId}`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getRequestByIdSlice = createSlice({
    name: 'getRequestById',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRequestById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRequestById.fulfilled, (state, action) => {
                state.loading = false;
                state.requestDetail = action.payload;
            })
            .addCase(getRequestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getRequestByIdSlice.reducer;
