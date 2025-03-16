import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, RejectedDataType } from "shared/types";
import { IArtist } from "shared/api/artist";
import { 
    createPlaylist,
    IPlaylist,
    // followPlaylist, 
    ISimplifiedPlaylist, 
    // unfollowPlaylist 
} from "shared/api/playlist";
import { 
    fetchLibraryAlbums, 
    fetchLibraryArtists, 
    fetchLibraryPlaylists, 
    fetchLibraryShows, 
    fetchLikedTracks, 
    // followArtists, 
    ISavedAlbum, 
    ISavedShow, 
    ISavedTracks,
    // removeAlbumsFromLibrary,
    // removeShowsFromLibrary,
    // saveAlbumsToLibrary,
    // saveShowsToLibrary,
    // unfollowArtists
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
    ISavedTracks[],
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

// export const saveAlbums = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/saveAlbums", async (ids, thunkAPI) => {
//     try {
//         await saveAlbumsToLibrary(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const removeAlbums = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/removeAlbums", async (ids, thunkAPI) => {
//     try {
//         await removeAlbumsFromLibrary(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const saveShows = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/saveShows", async (ids, thunkAPI) => {
//     try {
//         await saveShowsToLibrary(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const removeShows = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/removeShows", async (ids, thunkAPI) => {
//     try {
//         await removeShowsFromLibrary(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const savePlaylist = createAsyncThunk<
//     string,
//     string,
//     { readonly rejectValue: RejectedDataType }
// >("library/savePlaylist", async (id, thunkAPI) => {
//     try {
//         await followPlaylist(id);
//         return id;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const removePlaylist = createAsyncThunk<
//     string,
//     string,
//     { readonly rejectValue: RejectedDataType }
// >("library/removePlaylist", async (id, thunkAPI) => {
//     try {
//         await unfollowPlaylist(id);
//         return id;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const saveArtists = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/saveArtists", async (ids, thunkAPI) => {
//     try {
//         await followArtists(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })

// export const removeArtists = createAsyncThunk<
//     string[],
//     string[],
//     { readonly rejectValue: RejectedDataType }
// >("library/saveShows", async (ids, thunkAPI) => {
//     try {
//         await unfollowArtists(ids);
//         return ids;
//     } catch (e: unknown) {
//         const knownError = e as ErrorType;

//         return thunkAPI.rejectWithValue({
//             messageError: knownError.message,
//             status: knownError.response?.status
//         })
//     }
// })