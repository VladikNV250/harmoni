import { createSelector } from "@reduxjs/toolkit";
import { IAudiobookState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.audiobook,
)

export const selectAudiobooks = createSelector(
    selectBase,
    (state: IAudiobookState) => state.audiobooks,
)