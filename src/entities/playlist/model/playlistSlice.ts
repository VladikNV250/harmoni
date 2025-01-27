import { createSlice } from "@reduxjs/toolkit";
import { IPlaylistState } from "./type";
import { getPlaylist } from "./playlistThunk";

const initialState: IPlaylistState = {
    playlists: [],
    loading: false,
    error: null,
}

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getPlaylist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlaylist.fulfilled, (state, action) => {
                if (!state.playlists.find(playlist => playlist.id === action.payload.id))
                    state.playlists.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getPlaylist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default playlistSlice.reducer;