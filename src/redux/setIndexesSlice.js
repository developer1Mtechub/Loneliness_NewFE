import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lastIndex: 0
};

const setIndexesSlice = createSlice({
    name: 'setLastIndex',
    initialState,
    reducers: {
        setLastIndex: (state, action) => {
            state.lastIndex = action.payload;
        }
    },
});

export const { setLastIndex } = setIndexesSlice.actions;

export default setIndexesSlice.reducer;
