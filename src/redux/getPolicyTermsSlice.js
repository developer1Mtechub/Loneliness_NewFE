// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const getPolicyAndTerms = createAsyncThunk(
    'getPolicyAndTerms/getPolicyAndTerms',
    async (type, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            const data = await makeRequest('GET', `/policies/get/${type}`, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getPolicyTermsSlice = createSlice({
    name: 'getPolicyAndTerms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPolicyAndTerms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPolicyAndTerms.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(getPolicyAndTerms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getPolicyTermsSlice.reducer;
