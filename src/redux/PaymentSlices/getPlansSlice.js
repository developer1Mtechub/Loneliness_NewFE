import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL_PAYMENT } from '@env'

const initialState = {
    plans: [],
    loading: false,
    error: null,
};

export const getPlans = createAsyncThunk(
    'getPlans/getPlans',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = `Bearer ${auth.token}`;

            console.log('ull', `${API_BASE_URL_PAYMENT}/list-plans/PROD-62360949KU663215L`)

            const response = await fetch(`${API_BASE_URL_PAYMENT}/list-plans/PROD-62360949KU663215L`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
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


const getPlansSlice = createSlice({
    name: 'getPlans',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload?.plans;
            })
            .addCase(getPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getPlansSlice.reducer;
