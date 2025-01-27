import { IPlaylist, RejectedDataType } from "shared/types";

export interface IPlaylistState {
    playlists: IPlaylist[];
    loading: boolean;
    error: RejectedDataType | null;
}