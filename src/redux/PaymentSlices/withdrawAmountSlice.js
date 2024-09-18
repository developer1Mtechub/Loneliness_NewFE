// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const withdrawAmount = createAsyncThunk(
    'withdrawAmount/withdrawAmount',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('POST', '/payments/services/withdraw/buddy', payload, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const withdrawAmountSlice = createSlice({
    name: 'withdrawAmount',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(withdrawAmount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawAmount.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(withdrawAmount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default withdrawAmountSlice.reducer;
