import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL_PAYMENT } from '@env'

const initialState = {
    response: null,
    loading: false,
    error: null,
};

export const checkSubscriptionExist = createAsyncThunk(
    'checkSubscriptionExist/checkSubscriptionExist',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;

            const response = await fetch(`${API_BASE_URL_PAYMENT}/subscription`, {
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


const checkSubscriptionExistSlice = createSlice({
    name: 'checkSubscriptionExist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkSubscriptionExist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkSubscriptionExist.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload?.subscription;
            })
            .addCase(checkSubscriptionExist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default checkSubscriptionExistSlice.reducer;
