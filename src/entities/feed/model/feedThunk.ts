import { createAsyncThunk } from "@reduxjs/toolkit";
import { IFeed } from "./types";
import { ErrorType, RejectedDataType } from "shared/types";
import { fetchSeveralPlaylists } from "shared/api/playlist";
import { fetchNewReleases, fetchSeveralAlbums, IAlbum } from "shared/api/album";
import { fetchSeveralArtists } from "shared/api/artist";
import { fetchSeveralShows } from "shared/api/show";
import { fetchSeveralEpisodes } from "shared/api/episode";
import { fetchUserTopArtists } from "shared/api/user";

export const getFeedPlaylists = createAsyncThunk<
    IFeed,
    {name: string, ids: string[]},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedPlaylists", async ({name, ids}, thunkAPI) => {
    try {
        const response = await fetchSeveralPlaylists(ids);
        return {
            name, 
            items: response,
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
    {name: string, ids: string[]},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedAlbums", async ({name, ids}, thunkAPI) => {
    try {
        const response = await fetchSeveralAlbums(ids);
        return {
            name, 
            items: response.albums
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
    {name: string, ids: string[]},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedArtists", async ({name, ids}, thunkAPI) => {
    try {
        const response = await fetchSeveralArtists(ids);
        return {
            name, 
            items: response.artists
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
    {name: string, ids: string[]},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedShows", async ({name, ids}, thunkAPI) => {
    try {
        const response = await fetchSeveralShows(ids);
        return {
            name, 
            items: response.shows
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
    {name: string, ids: string[]},
    { readonly rejectValue: RejectedDataType }
>("feed/getFeedEpisodes", async ({name, ids}, thunkAPI) => {
    try {
        const response = await fetchSeveralEpisodes(ids);
        return {
            name, 
            items: response.episodes
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
    void,
    { readonly rejectValue: RejectedDataType }
>("feed/getNewReleases", async (_, thunkAPI) => {
    try {
        const response = await fetchNewReleases();
        
        return {
            name: "New Releases", 
            items: response.albums.items as IAlbum[]
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
    void,
    { readonly rejectValue: RejectedDataType }
>("feed/getUserTopArtists", async (_, thunkAPI) => {
    try {
        const response = await fetchUserTopArtists();
        
        return {
            name: "Your Top Artists", 
            items: response.items,
        };
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})