import { createSlice } from "@reduxjs/toolkit";
import { IAudiobookState } from "./types";
import example7 from "shared/assets/example7.png";

const initialState: IAudiobookState = {
    audiobooks: [
        {
            type: "audiobook",
            name: "Halo: The Flood",
            preview: example7,
            author: "William C. Dietz",
        },
        {
            type: "audiobook",
            name: "Halo: First Strike",
            preview: example7,
            author: "Eric Nylund",
        },
        {
            type: "audiobook",
            name: "Halo: Ghosts of Onyx",
            preview: "",
            author: "Eric Nylund",
        },
        {
            type: "audiobook",
            name: "Halo: The Flood",
            preview: example7,
            author: "William C. Dietz",
        },
    ]
}

export const audiobookSlice = createSlice({
    name: "audiobook",
    initialState,
    reducers: {},
})

export default audiobookSlice.reducer;