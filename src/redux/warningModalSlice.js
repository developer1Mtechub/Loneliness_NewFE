import { createSlice } from '@reduxjs/toolkit';
import { getWarningDescription } from '../constant/warningDescription';

const initialState = {
    warningContent: {
        modalVisible: false,
        description: getWarningDescription()
    }
};

const warningModalSlice = createSlice({
    name: 'warningContent',
    initialState,
    reducers: {
        setWarningContent: (state, action) => {
            state.warningContent.modalVisible = action.payload;
        },
    },
});

export const { setWarningContent } = warningModalSlice.actions;

export default warningModalSlice.reducer;
