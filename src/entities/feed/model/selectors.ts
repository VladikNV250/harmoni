import { createSelector } from "@reduxjs/toolkit";
import { IFeedState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.feed,
)

export const selectFeeds = createSelector(
    selectBase,
    (state: IFeedState) => state.feeds,
)

export const selectFeedSettings = createSelector(
    selectBase,
    (state: IFeedState) => state.settings,
)

export const selectFeedUserTracks = createSelector(
    selectBase,
    (state: IFeedState) => state.userTracks,
)

export const selectFeedLoading = createSelector(
    selectBase,
    (state: IFeedState) => state.loading,
)

export const selectFeedError = createSelector(
    selectBase,
    (state: IFeedState) => state.error,
)