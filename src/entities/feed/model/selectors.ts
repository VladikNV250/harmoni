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