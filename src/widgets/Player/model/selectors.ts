import { createSelector } from "@reduxjs/toolkit";
import { IPlayerState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.player, 
)

export const selectPlayerFullsreenMode = createSelector(
    selectBase,
    (state: IPlayerState) => state.fullscreenMode,
)