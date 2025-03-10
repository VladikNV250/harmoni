import { createSelector } from "@reduxjs/toolkit";
import { ISearchState } from "./type";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.search
)

export const selectSearch = createSelector(
    selectBase,
    (state: ISearchState) => state.search,
)

export const selectBrowseCategories = createSelector(
    selectBase,
    (state: ISearchState) => state.categories,
)

export const selectSearchLoading = createSelector(
    selectBase,
    (state: ISearchState) => state.loading,
)

export const selectSearchError = createSelector(
    selectBase,
    (state: ISearchState) => state.error,
)