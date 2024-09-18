import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null
};

const currentUserIndexSlice = createSlice({
    name: 'currentUserIndex',
    initialState,
    reducers: {
        setCurrentUserIndex: (state, action) => {
            state.currentUser = action.payload;
        }
    },
});

export const { setCurrentUserIndex } = currentUserIndexSlice.actions;

export default currentUserIndexSlice.reducer;
