import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayerState } from "./types";

const initialState: IPlayerState = {
    fullscreenMode: false,
    openedMenu: "none",
}

export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        toggleFullscreenMode: (state) => {
            state.fullscreenMode = !state.fullscreenMode;
        },
        setOpenedMenu: (state, action: PayloadAction<IPlayerState["openedMenu"]>) => {
            if (state.openedMenu !== action.payload && action.payload) {
                state.openedMenu = action.payload;
            } else {
                if (action.payload === "queue" || action.payload === "device") {
                    state.openedMenu = "track";
                } else {
                    state.openedMenu = "none";
                }
            }
        }
    },
});

export default playerSlice.reducer;