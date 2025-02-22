import { createSlice } from "@reduxjs/toolkit";
import { IQueueState } from "./types";
import { getUserQueue } from "./queueThunk";

const initialState: IQueueState = {
    queue: null,
    loading: false,
    error: null,
}

export const queueSlice = createSlice({
    name: "queue",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getUserQueue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserQueue.fulfilled, (state, action) => {
                state.queue = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserQueue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default queueSlice.reducer;