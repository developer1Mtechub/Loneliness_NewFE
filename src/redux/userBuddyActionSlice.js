// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const userBuddyAction = createAsyncThunk(
    'userBuddyAction/userBuddyAction',
    async (requestPayload, { getState, rejectWithValue }) => {
        try {
            const { token, role } = getState().auth
            const urlEndPoint = role === "USER" ? "/users/actions/buddy" : "/users/actions-buddy"
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('POST', urlEndPoint, requestPayload, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const userBuddyActionSlice = createSlice({
    name: 'userBuddyAction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userBuddyAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userBuddyAction.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(userBuddyAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userBuddyActionSlice.reducer;
