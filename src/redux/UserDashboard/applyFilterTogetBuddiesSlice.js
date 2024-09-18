// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import makeRequest from '../../configs/makeRequest';
const baseEndpoint = "/users/apply-filters/buddies";

const initialState = {
    filteredData: null,
    filterLoader: false,
    error: null,
};

function buildQueryString(params) {
    return Object.entries(params)
        .filter(([key, value]) => value !== null && value !== undefined && value !== '' && value !== false)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

export const applyFilterTogetBuddies = createAsyncThunk(
    'applyFilter/applyFilterTogetBuddies',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const queryString = buildQueryString(payload);
            const filterUrl = `${baseEndpoint}?${queryString}`;
            const { token } = getState().auth
            const bearerToken = `Bearer ${token}`
            console.log(filterUrl)
            const data = await makeRequest('GET', filterUrl, null, null, bearerToken);
            return data;
        } catch (error) {
            return error
        }
    }
);

const applyFilterTogetBuddiesSlice = createSlice({
    name: 'applyFilter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(applyFilterTogetBuddies.pending, (state) => {
                state.filterLoader = true;
                state.error = null;
            })
            .addCase(applyFilterTogetBuddies.fulfilled, (state, action) => {
                state.filterLoader = false;
                state.filteredData = action.payload?.result;
            })
            .addCase(applyFilterTogetBuddies.rejected, (state, action) => {
                state.filterLoader = false;
                state.error = action.payload;
            });
    },
});

export default applyFilterTogetBuddiesSlice.reducer;
