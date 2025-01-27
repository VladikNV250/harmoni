import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFeed, IFeedState } from "./types";

const initialState: IFeedState = {
    feeds: [
        {
            name: "New Releases",
            isPined: true,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Made For You",
            isPined: true,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Recently Played",
            isPined: true,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Your Playlists",
            isPined: false,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Recommended Radio",
            isPined: false,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Your Favorite Artists",
            isPined: false,
            isHidden: false,
            itemType: "artist",
        },
        {
            name: "Albums For You",
            isPined: false,
            isHidden: false,
            itemType: "album",
        },
        {
            name: "Your Top Mixes",
            isPined: false,
            isHidden: false,
            itemType: "playlist",
        },
        {
            name: "Spotify Original Podcasts",
            isPined: false,
            isHidden: false,
            itemType: "show",
        },
        {
            name: "Episodes For You",
            isPined: false,
            isHidden: false,
            itemType: "episode",
        },
        {
            name: "Your Top Mixes",
            isPined: false,
            isHidden: false,
            itemType: "playlist",
        },
    ]
}

export const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {
        addFeed: (state, action: PayloadAction<IFeed>) => {
            state.feeds.push(action.payload);
        },
        pinFeed: (state, action: PayloadAction<{name: string}>) => {
            const feedIndex = state.feeds?.findIndex(feed => feed.name === action.payload.name);

            state.feeds[feedIndex].isPined = !state.feeds[feedIndex].isPined;
        },
        hideFeed: (state, action: PayloadAction<{name: string}>) => {
            const feedIndex = state.feeds?.findIndex(feed => feed.name === action.payload.name);
            
            if (state.feeds[feedIndex].isHidden) {
                state.feeds[feedIndex].isHidden = false;
                state.feeds[feedIndex].isPined = false;
            } else {
                state.feeds[feedIndex].isHidden = true;
            }
        }
    },
})

export default feedSlice.reducer;