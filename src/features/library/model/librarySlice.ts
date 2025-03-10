import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ILibraryState } from "./type"
import { 
    createPlaylistThunk,
    getLibraryAlbums, 
    getLibraryArtists, 
    getLibraryPlaylists, 
    getLibraryShows, 
    getLikedTracks, 
} from "./libraryThunk"
import { IFolder } from "entities/folder"
import { IPlaylist } from "shared/api/playlist"

const initialState: ILibraryState = {
    albums:    [],
    artists:   [],
    playlists: [],
    shows:     [],
    tracks:    [],
    folders:   [],
    
    loading:   false,
    error:     null,
}

export const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        createFolder: (state, action: PayloadAction<IFolder>) => {
            state.folders.push(action.payload);
        },
        addToFolder: (state, action: PayloadAction<{id: IFolder["id"], item: IPlaylist}>) => {
            const { id, item } = action.payload;
            state.folders
                .find(folder => folder.id === id)
                ?.items.push(item);
        },
        removeFromFolder: (state, action: PayloadAction<{id: IFolder["id"], itemId: string}>) => {
            const { id, itemId } = action.payload;
            state.folders
                .find(folder => folder.id === id)
                ?.items.filter(item => item.id !== itemId);
        },
        deleteFolder: (state, action: PayloadAction<IFolder["id"]>) => {
            state.folders = state.folders.filter(folder => folder.id !== action.payload);
        },
        changeFolderName: (state, action: PayloadAction<{id: IFolder["id"], newName: string}>) => {
            const { id, newName } = action.payload;
            const folderIndex = state.folders.findIndex(folder => folder.id === id);

            if (folderIndex !== -1) {
                state.folders[folderIndex].name = newName;
            }
        }
    },
    extraReducers: builder =>
        builder
            .addCase(getLibraryPlaylists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLibraryPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.playlists = action.payload;
            })
            .addCase(getLibraryPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getLibraryAlbums.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLibraryAlbums.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.albums = action.payload;
            })
            .addCase(getLibraryAlbums.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getLibraryShows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLibraryShows.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.shows = action.payload;
            })
            .addCase(getLibraryShows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getLibraryArtists.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLibraryArtists.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.artists = action.payload;
            })
            .addCase(getLibraryArtists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(getLikedTracks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLikedTracks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.tracks = action.payload;
                // state.playlists.push(LikedPlaylist);                
            })
            .addCase(getLikedTracks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
            .addCase(createPlaylistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlaylistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.playlists.push(action.payload);                
            })
            .addCase(createPlaylistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default librarySlice.reducer;