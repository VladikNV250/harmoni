import { createSlice } from "@reduxjs/toolkit";
import { IShowState } from "./types";
import { getShow } from "./showThunk";

const initialState: IShowState = {
    shows: [],
    loading: false,
    error: null,
}

export const showSlice = createSlice({
    name: "show",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getShow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getShow.fulfilled, (state, action) => {
                if (!state.shows.find(show => show.id === action.payload.id))
                    state.shows.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getShow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default showSlice.reducer;