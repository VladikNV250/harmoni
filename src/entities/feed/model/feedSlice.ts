import { createSlice } from "@reduxjs/toolkit";
import { IFeedState } from "./types";
import { getFeedAlbums, getFeedArtists, getFeedEpisodes, getFeedPlaylists, getFeedShows, getNewReleases, getUserTopArtists } from "./feedThunk";

const initialState: IFeedState = {
    feeds: {},
    loading: false,
    error: null,
}

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        // addFeed: (state, action: PayloadAction<IFeed>) => {
        //     state.feeds.push(action.payload);
        // },
        // pinFeed: (state, action: PayloadAction<{name: string}>) => {
        //     const feedIndex = state.feeds?.findIndex(feed => feed.name === action.payload.name);

        //     state.feeds[feedIndex].isPined = !state.feeds[feedIndex].isPined;
        // },
        // hideFeed: (state, action: PayloadAction<{name: string}>) => {
        //     const feedIndex = state.feeds?.findIndex(feed => feed.name === action.payload.name);
            
        //     if (state.feeds[feedIndex].isHidden) {
        //         state.feeds[feedIndex].isHidden = false;
        //         state.feeds[feedIndex].isPined = false;
        //     } else {
        //         state.feeds[feedIndex].isHidden = true;
        //     }
        // }
    },
    extraReducers: builder =>
        builder
            .addCase(getFeedPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedPlaylists.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFeedPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getFeedAlbums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedAlbums.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFeedAlbums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getFeedArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedArtists.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFeedArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getFeedEpisodes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedEpisodes.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFeedEpisodes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getFeedShows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedShows.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFeedShows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getNewReleases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNewReleases.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getNewReleases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getUserTopArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTopArtists.fulfilled, (state, action) => {
                state.feeds[action.payload.name] = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserTopArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default feedSlice.reducer;