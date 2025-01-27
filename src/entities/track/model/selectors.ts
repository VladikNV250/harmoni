import { createSelector } from "@reduxjs/toolkit";
import { ITrackState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.track,
)

export const selectTracks = createSelector(
    selectBase,
    (state: ITrackState) => state.tracks,
)

export const selectTrackLoading = createSelector(
    selectBase,
    (state: ITrackState) => state.loading,
)

export const selectTrackError = createSelector(
    selectBase,
    (state: ITrackState) => state.error,
)