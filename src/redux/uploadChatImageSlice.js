// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const uploadChatImage = createAsyncThunk(
    'uploadChatImage/uploadChatImage',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;
            const data = await makeRequest('POST', '/users/upload-image-chat', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const uploadChatImageSlice = createSlice({
    name: 'uploadChatImage',
    initialState,
    reducers: {
        clearResponse(state) {
            state.response = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadChatImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadChatImage.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(uploadChatImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});
export const { clearResponse } = uploadChatImageSlice.actions;
export default uploadChatImageSlice.reducer;
