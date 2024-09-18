import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAppOpened: false
};

const appOpenedSlice = createSlice({
    name: 'appOpened',
    initialState,
    reducers: {
        setIsAppOpened: (state, action) => {
            state.isAppOpened = action.payload;
        }
    },
});

export const { setIsAppOpened } = appOpenedSlice.actions;

export default appOpenedSlice.reducer;
