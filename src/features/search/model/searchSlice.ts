import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISearchState } from "./type";
import { 
    getSeveralBrowseCategories, 
    searchForItemThunk 
} from "./searchThunk";

const initialState: ISearchState = {
    search: {
        albums: [],
        artists: [],
        episodes: [],
        playlists: [],
        shows: [],
        tracks: [],
    },
    categories: [],
    query: "",
    loading: false,
    error: null,
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(searchForItemThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchForItemThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                
                const { 
                    albums,
                    artists,
                    episodes,
                    playlists,
                    shows,
                    tracks
                } = action.payload;

                state.search.shows     = shows?.items     ?? []; 
                state.search.albums    = albums?.items    ?? []; 
                state.search.tracks    = tracks?.items    ?? []; 
                state.search.artists   = artists?.items   ?? []; 
                state.search.episodes  = episodes?.items  ?? []; 
                state.search.playlists = playlists?.items ?? []; 
            })
            .addCase(searchForItemThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getSeveralBrowseCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSeveralBrowseCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.categories = action.payload;
            })
            .addCase(getSeveralBrowseCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default searchSlice.reducer;