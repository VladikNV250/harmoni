import { createSelector } from "@reduxjs/toolkit"
import { IQueueState } from "./types"

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.queue, 
)

export const selectQueue = createSelector(
    selectBase,
    (state: IQueueState) => state.queue,
)

export const selectQueueLoading = createSelector(
    selectBase,
    (state: IQueueState) => state.loading,
)

export const selectQueueError = createSelector(
    selectBase,
    (state: IQueueState) => state.error,
)