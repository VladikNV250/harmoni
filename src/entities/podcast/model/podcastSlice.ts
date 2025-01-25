import { createSlice } from "@reduxjs/toolkit";
import { IPodcastState } from "./types";
import example8 from "shared/assets/example8.png";
import example9 from "shared/assets/example9.png";
import example10 from "shared/assets/example10.png";

const initialState: IPodcastState = {
    podcasts: [
        {
            type: "podcast",
            name: "anything goes...",
            preview: example9,
            author: "emma chamberlain",
        },
        {
            type: "podcast",
            name: "The Joe Rogan Expirience",
            preview: example8,
            author: "Joe Rogan",
        },
        {
            type: "podcast",
            name: "The Journal",
            preview: example10,
            author: "The Wall Street Journal",
        },
    ]
}

export const podcastSlice = createSlice({
    name: "podcast",
    initialState,
    reducers: {},
})

export default podcastSlice.reducer;