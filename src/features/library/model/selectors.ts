import { createSelector } from "@reduxjs/toolkit"
import { ILibraryState } from "./type"

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.library
)

export const selectSavedAlbums = createSelector(
    selectBase,
    (state: ILibraryState) => state.albums,
)

export const selectSavedPlaylists = createSelector(
    selectBase,
    (state: ILibraryState) => state.playlists,
)

export const selectSavedShows = createSelector(
    selectBase,
    (state: ILibraryState) => state.shows,
)

export const selectFollowedArtists = createSelector(
    selectBase,
    (state: ILibraryState) => state.artists,
)

export const selectFolders = createSelector(
    selectBase,
    (state: ILibraryState) => state.folders,
)

export const selectLibraryLoading = createSelector(
    selectBase,
    (state: ILibraryState) => state.loading,
)

export const selectLibraryError = createSelector(
    selectBase,
    (state: ILibraryState) => state.error,
)