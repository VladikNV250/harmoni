import { createSelector } from "@reduxjs/toolkit";
import { IPlaylistState } from "./type";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.playlist
)

export const selectPlaylists = createSelector(
    selectBase,
    (state: IPlaylistState) => state.playlists,
)

export const selectPlaylistLoading = createSelector(
    selectBase,
    (state: IPlaylistState) => state.loading,
)

export const selectPlaylistError = createSelector(
    selectBase,
    (state: IPlaylistState) => state.error,
)