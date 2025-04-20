import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFeedState } from "./types";
import { 
    getFeedAlbums, 
    getFeedArtists, 
    getFeedEpisodes, 
    getFeedPlaylists, 
    getFeedShows, 
    getNewReleases, 
    getUserTopArtists, 
    getUserTopTracks
} from "./feedThunk";

const initialState: IFeedState = {
    feeds: {},
    loading: false,
    error: null,
    userTracks: {
        items: [],
        showForUser: true,
    },
    settings: {
        updateAfterEveryReload: true,
    }
}

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        setUpdateAfterEveryReload: (state, action: PayloadAction<boolean>) => {
            state.settings.updateAfterEveryReload = action.payload;
        },
        setShowForUser: (state, action: PayloadAction<boolean>) => {
            state.userTracks.showForUser = action.payload;
        },
        // addFeed: (state, action: PayloadAction<IFeed>) => {
        //     state.feeds.push(action.payload);
        // },
        moveUpFeed: (state, action: PayloadAction<string>) => {
            const sortedFeeds = Object.fromEntries(
                Object.entries(state.feeds).sort((a, b) => a[1].order - b[1].order  // sort feeds from smallest to largest
            ))

            const movedFeed = state.feeds[action.payload];
            if (movedFeed) {
                const feedNames = Object.keys(sortedFeeds)
                const feedIndex = feedNames.findIndex(feedName => feedName === movedFeed.name);
                
                if (feedIndex !== 0) {
                    const replacedFeed = state.feeds[feedNames[feedIndex - 1]];
                    if (
                        (replacedFeed.order >= 0 && movedFeed.order >= 1) ||
                        (replacedFeed.order < 0 && movedFeed.order < 0)
                    ) {
                        const orderBuffer = replacedFeed.order;
                        replacedFeed.order = movedFeed.order;
                        movedFeed.order = orderBuffer;
                    }
                }
            }
        },
        moveDownFeed: (state, action: PayloadAction<string>) => {
            const sortedFeeds = Object.fromEntries(
                Object.entries(state.feeds).sort((a, b) => a[1].order - b[1].order  // sort feeds from smallest to largest
            ))

            const movedFeed = state.feeds[action.payload];
            if (movedFeed) {
                const feedNames = Object.keys(sortedFeeds)
                const feedIndex = feedNames.findIndex(feedName => feedName === movedFeed.name);
                
                if (feedIndex !== feedNames.length - 1) {
                    const replacedFeed = state.feeds[feedNames[feedIndex + 1]];

                    if (
                        (replacedFeed.order >= 0 && movedFeed.order >= 1) ||
                        (replacedFeed.order < 0 && movedFeed.order < 0)
                    ) {
                        const orderBuffer = replacedFeed.order;
                        replacedFeed.order = movedFeed.order;
                        movedFeed.order = orderBuffer;
                    }
                }
            }
        },
        pinFeed: (state, action: PayloadAction<string>) => {
            if (state.feeds[action.payload]) {
                state.feeds[action.payload].order = -state.feeds[action.payload].order; 
                state.feeds[action.payload].hidden.isHidden = false;
            }
        },
        hideFeed: (state, action: PayloadAction<string>) => {
            if (state.feeds[action.payload]) {
                state.feeds[action.payload].hidden.isHidden = !state.feeds[action.payload].hidden.isHidden;
                state.feeds[action.payload].order = Math.abs(state.feeds[action.payload].order);
            }
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getFeedPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedPlaylists.fulfilled, (state, action) => {
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
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
                if (state.feeds[action.payload.name])
                    state.feeds[action.payload.name].items = action.payload.items;
                else
                    state.feeds[action.payload.name] = action.payload;
                
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserTopArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getUserTopTracks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserTopTracks.fulfilled, (state, action) => {
                state.userTracks.items = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getUserTopTracks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default feedSlice.reducer;