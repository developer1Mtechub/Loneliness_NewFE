import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rememberMe: null
};

const rememberMeSlice = createSlice({
    name: 'rememberMe',
    initialState,
    reducers: {
        setAsRemember: (state, action) => {
            state.rememberMe = action.payload;
        },
    },
});

export const { setAsRemember } = rememberMeSlice.actions;

export default rememberMeSlice.reducer;
