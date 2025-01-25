import { createSelector } from "@reduxjs/toolkit";
import { IPodcastState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.podcastReducer,
)

export const selectPodcasts = createSelector(
    selectBase,
    (state: IPodcastState) => state.podcasts,
)