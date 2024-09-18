// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const updateProfile = createAsyncThunk(
    'createProfile/updateProfile',
    async (profilePayload, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.token ? `Bearer ${auth.token}` : `Bearer ${signup.bearerToken}`;
            const data = await makeRequest('PUT', '/users/update-profile', profilePayload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const updateProfileSlice = createSlice({
    name: 'createProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default updateProfileSlice.reducer;
