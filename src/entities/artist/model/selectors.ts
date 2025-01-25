import { createSelector } from "@reduxjs/toolkit";
import { IArtistState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.artist,
)

export const selectArtists = createSelector(
    selectBase,
    (state: IArtistState) => state.artists,
)