import { createSelector } from "@reduxjs/toolkit";
import { IUserState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.user,
)

export const selectUser = createSelector(
    selectBase,
    (state: IUserState) => state.user,
)

export const selectUserLoading = createSelector(
    selectBase,
    (state: IUserState) => state.loading,
)

export const selectUserError = createSelector(
    selectBase,
    (state: IUserState) => state.error,
)