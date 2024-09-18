import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    credentials: null
};

const setTemCredentialsSlice = createSlice({
    name: 'tempCredentials',
    initialState,
    reducers: {
        setTempCred: (state, action) => {
            state.credentials = action.payload;
        }
    },
});

export const { setTempCred } = setTemCredentialsSlice.actions;

export default setTemCredentialsSlice.reducer;
