// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/payments/services/get-transactions";

const initialState = {
    transactions: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    walletAmount: 0,
};

export const getTransactionHistory = createAsyncThunk(
    'getTransactionHistory/getTransactionHistory',
    async ({ page = 1, limit = 10, is_refunded }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth;
            const bearerToken = `Bearer ${token}`;
            let url = `${baseEndpoint}?page=${page}&limit=${limit}&is_refunded=${is_refunded}`;
            console.log(url)
            const data = await makeRequest('GET', url, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getTransactionHistorySlice = createSlice({
    name: 'getTransactionHistory',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransactionHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTransactionHistory.fulfilled, (state, action) => {
                state.loading = false;
                if (action.meta.arg.page === 1) {
                    state.transactions = action.payload.result?.transactions?.data;
                } else {
                    state.transactions = [...state.transactions, ...action.payload.result?.transactions?.data];
                }
                state.currentPage = action.meta.arg.page;
                state.totalPages = action.payload.result?.transactions?.totalPages;
                state.walletAmount = action.payload.result?.wallet_amount || 0
            })
            .addCase(getTransactionHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getTransactionHistorySlice.reducer;
