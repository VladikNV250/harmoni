import { createSlice } from "@reduxjs/toolkit";
import { IArtistState } from "./types";
import example6 from "shared/assets/example6.png";

const initialState: IArtistState = {
    artists: [
        {
            type: "artist",
            name: "Daft Punk",
            preview: example6,
        },
        {
            type: "artist",
            name: "Guns N’ Roses",
            preview: "",
        },
        {
            type: "artist",
            name: "David Bowie",
            preview: example6,
        },
    ]
}

export const artistSlice = createSlice({
    name: "artist",
    initialState,
    reducers: {},
})

export default artistSlice.reducer;