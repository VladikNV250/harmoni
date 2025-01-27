import { createSlice } from "@reduxjs/toolkit";
import { IAlbumState } from "./types";
import { getAlbum } from "./albumThunk";

const initialState: IAlbumState = {
    albums: [],
    loading: false,
    error: null
}

export const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getAlbum.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAlbum.fulfilled, (state, action) => {
                if (!state.albums.find(album => album.id === action.payload.id))
                    state.albums.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getAlbum.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default albumSlice.reducer;