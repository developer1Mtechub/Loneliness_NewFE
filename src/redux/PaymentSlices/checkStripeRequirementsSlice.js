// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const checkStripeRequirements = createAsyncThunk(
    'checkStripeRequirements/checkStripeRequirements',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.token ? `Bearer ${auth.token}` : `Bearer ${signup.bearerToken}`;
            const data = await makeRequest('POST', '/payments/connected-account/check-requirement/status', null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const checkStripeRequirementsSlice = createSlice({
    name: 'checkStripeRequirements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkStripeRequirements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkStripeRequirements.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(checkStripeRequirements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkStripeRequirementsSlice.reducer;
