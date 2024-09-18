import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL_PAYMENT } from '@env'

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const executeChatPayment = createAsyncThunk(
    'executeChatPayment/executeChatPayment',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;

            const response = await fetch(`${API_BASE_URL_PAYMENT}/execute-payment-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch PayPal URL');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }
);


const executeChatPaymentSlice = createSlice({
    name: 'executeChatPayment',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(executeChatPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(executeChatPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.result;
            })
            .addCase(executeChatPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default executeChatPaymentSlice.reducer;
