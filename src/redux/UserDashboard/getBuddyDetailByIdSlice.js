// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/requests/get/";

const initialState = {
    buddyDetail: null,
    loading: false,
    error: null,
};

export const getBuddyDetailById = createAsyncThunk(
    'getBuddyDetailById/getBuddyDetailById',
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

const getBuddyDetailByIdSlice = createSlice({
    name: 'getBuddyDetailById',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBuddyDetailById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBuddyDetailById.fulfilled, (state, action) => {
                state.loading = false;
                state.buddyDetail = action.payload?.result;
            })
            .addCase(getBuddyDetailById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getBuddyDetailByIdSlice.reducer;
