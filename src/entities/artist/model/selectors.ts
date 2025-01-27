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

export const selectArtistLoading = createSelector(
    selectBase,
    (state: IArtistState) => state.loading,
)

export const selectArtistError = createSelector(
    selectBase,
    (state: IArtistState) => state.error,
)