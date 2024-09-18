// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const createCustomer = createAsyncThunk(
    'createCustomer/createCustomer',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`
            const data = await makeRequest('POST', '/payments/stripe/create-customer', null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const createCustomerSlice = createSlice({
    name: 'createCustomer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result?.data;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default createCustomerSlice.reducer;
