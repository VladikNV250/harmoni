import { createSlice } from "@reduxjs/toolkit";
import { IArtistState } from "./types";
import { getArtist } from "./artistThunk";

const initialState: IArtistState = {
    artists: [],
    loading: false,
    error: null
}

export const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {},
    extraReducers: buider =>
        buider
            .addCase(getArtist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getArtist.fulfilled, (state, action) => {
                if (!state.artists.find(artist => artist.id === action.payload.id))
                    state.artists.push(action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(getArtist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null
            })
})

export default artistSlice.reducer;