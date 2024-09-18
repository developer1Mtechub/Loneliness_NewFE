// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../configs/makeRequest';

const initialState = {
    categories: null,
    loading: false,
    error: null,
};

export const getAllCategories = createAsyncThunk(
    'getCategories/getAllCategories',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { signup } = getState();
            const { auth } = getState();
            const token = auth.token ? `Bearer ${auth.token}` : `Bearer ${signup.bearerToken}`;
            const data = await makeRequest('GET', '/categories/getAll', null, null, token);
            return data;
        } catch (error) {
            return error
        }
    }
);

const getAllCategoriesSlice = createSlice({
    name: 'getCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload?.result?.data;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default getAllCategoriesSlice.reducer;
