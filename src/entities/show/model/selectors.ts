import { createSelector } from "@reduxjs/toolkit";
import { IShowState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.show,
)

export const selectShows = createSelector(
    selectBase,
    (state: IShowState) => state.shows,
)

export const selectShowLoading = createSelector(
    selectBase,
    (state: IShowState) => state.loading,
)

export const selectShowError = createSelector(
    selectBase,
    (state: IShowState) => state.error,
)