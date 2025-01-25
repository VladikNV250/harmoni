import { createSelector } from "@reduxjs/toolkit";
import { IAlbumState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.album,
)

export const selectAlbums = createSelector(
    selectBase,
    (state: IAlbumState) => state.albums,
)