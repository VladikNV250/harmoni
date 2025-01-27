import { createSlice } from "@reduxjs/toolkit";
import { IEpisodeState } from "./types";
import { getEpisode } from "./episodeThunk";

const initialState: IEpisodeState = {
    episodes: [],
    loading: false,
    error: null
}

export const episodeSlice = createSlice({
    name: "episode",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getEpisode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEpisode.fulfilled, (state, action) => {
                if (!state.episodes.find(episode => episode.id === action.payload.id))
                    state.episodes.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getEpisode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default episodeSlice.reducer;