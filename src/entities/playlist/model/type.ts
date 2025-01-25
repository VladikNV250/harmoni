export interface IPlaylistState {
    playlists: IPlaylist[];
    loading: boolean;
    error: Error | null;
}

export interface IPlaylist {
    type: "playlist"
    preview: string;
    name: string;
    tracks: number;
    description: string;
}