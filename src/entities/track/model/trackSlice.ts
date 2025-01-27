import { createSlice } from "@reduxjs/toolkit";
import { getTrack } from "./trackThunk";
import { ITrackState } from "./types";

const initialState: ITrackState = {
    tracks: [],
    loading: false,
    error: null
}

export const trackSlice = createSlice({
    name: "track",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getTrack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTrack.fulfilled, (state, action) => {
                if (!state.tracks.find(track => track.id === action.payload.id))
                    state.tracks.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getTrack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default trackSlice.reducer;