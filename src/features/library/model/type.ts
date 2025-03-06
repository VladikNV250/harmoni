import { IFolder } from "entities/folder";
import { IArtist } from "shared/api/artist";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { ISavedAlbum, ISavedShow } from "shared/api/user";
import { RejectedDataType } from "shared/types";

export interface ILibraryState {
    albums: ISavedAlbum[],
    playlists: ISimplifiedPlaylist[],
    shows: ISavedShow[],
    artists: IArtist[],
    folders: IFolder[],
    
    loading: boolean,
    error: RejectedDataType | null,
}