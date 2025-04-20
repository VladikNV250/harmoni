import { IFolder } from "entities/folder";
import { IArtist } from "shared/api/artist";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { ISavedAlbum, ISavedEpisode, ISavedShow, ISavedTrack } from "shared/api/user";
import { RejectedDataType } from "shared/types";

export interface ILibraryState {
    albums: ISavedAlbum[],
    playlists: ISimplifiedPlaylist[],
    shows: ISavedShow[],
    artists: IArtist[],
    tracks: ISavedTrack[],
    episodes: ISavedEpisode[],
    folders: IFolder[],
    
    filter: TLibraryFilter,

    loading: boolean,
    error: RejectedDataType | null,
}

export type TLibraryFilter = "all" | "folder" | "playlist" | "album" | "show" | "artist";