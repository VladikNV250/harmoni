import { createSlice } from "@reduxjs/toolkit";
import { IPlayerState } from "./types";

const initialState: IPlayerState = {
    fullscreenMode: false,
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        toggleFullscreenMode: (state) => {
            state.fullscreenMode = !state.fullscreenMode;
        },
    },
});

export default playerSlice.reducer;