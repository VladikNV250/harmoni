import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, RejectedDataType } from "shared/types";
import { IArtist } from "shared/api/artist";
import { 
    createPlaylist,
    IPlaylist,
    ISimplifiedPlaylist, 
} from "shared/api/playlist";
import { 
    fetchLibraryAlbums, 
    fetchLibraryArtists, 
    fetchLibraryEpisodes, 
    fetchLibraryPlaylists, 
    fetchLibraryShows, 
    fetchLikedTracks, 
    ISavedAlbum, 
    ISavedEpisode, 
    ISavedShow,
    ISavedTrack, 
} from "shared/api/user";

export const getLibraryAlbums = createAsyncThunk<
    ISavedAlbum[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLibraryAlbums", async (_, thunkAPI) => {
    try {
        const response = await fetchLibraryAlbums();
        return response.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getLibraryPlaylists = createAsyncThunk<
    ISimplifiedPlaylist[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLibraryPlaylists", async (_, thunkAPI) => {
    try {
        const response = await fetchLibraryPlaylists();
        return response.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getLibraryShows = createAsyncThunk<
    ISavedShow[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLibraryShows", async (_, thunkAPI) => {
    try {
        const response = await fetchLibraryShows();
        return response.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getLibraryArtists = createAsyncThunk<
    IArtist[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLibraryArtists", async (_, thunkAPI) => {
    try {
        const response = await fetchLibraryArtists();
        return response.artists.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getLikedTracks = createAsyncThunk<
    ISavedTrack[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLikedTracks", async (_, thunkAPI) => {
    try {
        const response = await fetchLikedTracks();
        return response.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getLikedEpisodes = createAsyncThunk<
    ISavedEpisode[],
    void,
    { readonly rejectValue: RejectedDataType }
>("library/getLikedEpisodes", async (_, thunkAPI) => {
    try {
        const response = await fetchLibraryEpisodes();
        return response.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response.status,
        })
    } 
})

export const createPlaylistThunk = createAsyncThunk<
    IPlaylist,
    {
        userId: string,
        body: {
            name: string,
            public?: boolean,
            collaborative?: boolean,
            description?: string,
        }
    },
    { readonly rejectValue: RejectedDataType }
>("library/createPlaylistThunk", async ({userId, body}, thunkAPI) => {
    try {
        const response = await createPlaylist(userId, body);
        return response.data;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
});