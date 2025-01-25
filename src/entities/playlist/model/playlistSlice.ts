import { createSlice } from "@reduxjs/toolkit";
import { IPlaylistState } from "./type";

import example from "shared/assets/example.png";
import example2 from "shared/assets/example2.png";
import example3 from "shared/assets/example3.png";
import example4 from "shared/assets/example4.png";
import example5 from "shared/assets/example5.png";

const initialState: IPlaylistState = {
    playlists: [
        {
            type: "playlist",
            name: "Discover Weekly",
            description: "Your weekly mixtape of fresh music.",
            tracks: 50,
            preview: example,
        },
        {
            type: "playlist",
            name: "Daily Mix 1",
            description: "Linkin Park, System Of A Down, Coal Chamber...",
            tracks: 50,
            preview: example2,
        },
        {
            type: "playlist",
            name: "Daily Mix 2",
            description: "Avril Lavigne, Lorde, Charli XCX and more",
            tracks: 50,
            preview: example3,
        },
        {
            type: "playlist",
            name: "Daily Mix 3",
            description: "The Strokes, Martin Garrix, MGMT and more",
            tracks: 50,
            preview: example4,
        },
        {
            type: "playlist",
            name: "Daily Mix 4",
            description: "Chuck Berry, Elvis Presley, Roy Orbison and more",
            tracks: 50,
            preview: example5,
        },
    ],
    loading: false,
    error: null,
}

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {}
})

export default playlistSlice.reducer;