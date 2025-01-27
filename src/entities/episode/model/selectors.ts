import { createSelector } from "@reduxjs/toolkit";
import { IEpisodeState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.episode,
)

export const selectEpisodes = createSelector(
    selectBase,
    (state: IEpisodeState) => state.episodes,
)

export const selectEpisodeLoading = createSelector(
    selectBase,
    (state: IEpisodeState) => state.loading,
)

export const selectEpisodeError = createSelector(
    selectBase,
    (state: IEpisodeState) => state.error,
)