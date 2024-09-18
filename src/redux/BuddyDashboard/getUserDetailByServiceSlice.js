// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/requests/get-buddy/";

const initialState = {
    userDetail: null,
    loading: false,
    error: null,
};

export const getUserDetailByService = createAsyncThunk(
    'getUserDetailByService/getUserDetailByService',
    async (requestId, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('GET', `${baseEndpoint}${requestId}`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getUserDetailByServiceSlice = createSlice({
    name: 'getUserDetailByService',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailByService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDetailByService.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetail = action.payload?.result;
            })
            .addCase(getUserDetailByService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getUserDetailByServiceSlice.reducer;
