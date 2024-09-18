import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPremiumPlan: true
};

const accountSubscriptionSlice = createSlice({
    name: 'accountSubscription',
    initialState,
    reducers: {
        setIsPremium: (state, action) => {
            state.isPremiumPlan = action.payload;
        }
    },
});

export const { setIsPremium } = accountSubscriptionSlice.actions;

export default accountSubscriptionSlice.reducer;
