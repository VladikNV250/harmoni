import { createSlice } from "@reduxjs/toolkit";
import { IAlbumState } from "./types";
import example11 from "shared/assets/example11.png";
import example6 from "shared/assets/example6.png";

const initialState: IAlbumState = {
    albums: [
        {
            type: "album",
            name: "Black Holes and Revelations",
            preview: example11,
            author: "Muse",
        },
        {
            type: "album",
            name: "Random Access Memories",
            preview: example6,
            author: "Daft Punk",
        },
        {
            type: "album",
            name: "Abbey Road",
            preview: "",
            author: "The Beatles",
        },
    ]
}

export const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {},
})

export default albumSlice.reducer;