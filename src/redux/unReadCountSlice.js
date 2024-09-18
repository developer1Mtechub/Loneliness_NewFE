import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unReadCount: 0
};

const unReadCountSlice = createSlice({
    name: 'unReadCount',
    initialState,
    reducers: {
        setUnReadCount: (state, action) => {
            state.unReadCount = action.payload;
        },
    },
});

export const { setUnReadCount } = unReadCountSlice.actions;

export default unReadCountSlice.reducer;
