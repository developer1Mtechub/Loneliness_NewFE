import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isNewNotification: false
};

const newNotificationSlice = createSlice({
    name: 'newNotification',
    initialState,
    reducers: {
        setNewNotification: (state, action) => {
            state.isNewNotification = action.payload;
        }
    },
});

export const { setNewNotification } = newNotificationSlice.actions;

export default newNotificationSlice.reducer;
