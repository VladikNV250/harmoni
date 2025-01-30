import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFeed } from "./types";
import { ErrorType, RejectedDataType } from "shared/types";
import { fetchSeveralPlaylists } from "shared/api/playlist";
import { fetchNewReleases, fetchSeveralAlbums, IAlbum } from "shared/api/album";
import { fetchSeveralArtists, IArtist } from "shared/api/artist";
import { fetchSeveralShows } from "shared/api/show";
import { fetchSeveralEpisodes } from "shared/api/episode";
import { fetchUserTopArtists, fetchUserTopTracks } from "shared/api/user";
import { ITrack } from "shared/api/track";

export const getFeedPlaylists = createAsyncThunk<
    IFeed,
    {name: string, ids: string[], order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedPlaylists", async ({name, ids, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchSeveralPlaylists(ids);
        return {
            name, 
            items: response,
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getFeedAlbums = createAsyncThunk<
    IFeed,
    {name: string, ids: string[], order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedAlbums", async ({name, ids, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchSeveralAlbums(ids);
        return {
            name, 
            items: response.albums,
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getFeedArtists = createAsyncThunk<
    IFeed,
    {name: string, ids: string[], order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedArtists", async ({name, ids, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchSeveralArtists(ids);
        return {
            name, 
            items: response.artists,
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getFeedShows = createAsyncThunk<
    IFeed,
    {name: string, ids: string[], order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedShows", async ({name, ids, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchSeveralShows(ids);
        return {
            name, 
            items: response.shows,
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getFeedEpisodes = createAsyncThunk<
    IFeed,
    {name: string, ids: string[], order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedEpisodes", async ({name, ids, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchSeveralEpisodes(ids);
        return {
            name, 
            items: response.episodes,
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getNewReleases = createAsyncThunk<
    IFeed,
    {name: string, order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getNewReleases", async ({name, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchNewReleases();
        
        return {
            name, 
            items: response.albums.items as IAlbum[],
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getUserTopArtists = createAsyncThunk<
    IFeed,
    {name: string, order?: number, hidden?: boolean},
    { readonly rejectValue: RejectedDataType }
>("feed/getUserTopArtists", async ({name, order = 0, hidden}, thunkAPI) => {
    try {
        const response = await fetchUserTopArtists();
        
        return {
            name, 
            items: response.items as IArtist[],
            hidden: {
                isHidden: hidden ?? false,
                locked: false,
            },
            order: order,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getUserTopTracks = createAsyncThunk<
    ITrack[],
    {limit?: number, offset?: number, time_range?: string},
    { readonly rejectValue: RejectedDataType }
>("feed/getUserTopTracks", async (options = {}, thunkAPI) => {
    try {
        const response = await fetchUserTopTracks(options);
        
        return response.items as ITrack[];
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})