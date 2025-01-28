import { IAlbum } from "shared/api/album";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IPlaylist } from "shared/api/playlist";
import { IShow } from "shared/api/show";
import { RejectedDataType } from "shared/types";

export interface IFeedState {
    feeds: {
        [key: string]: IFeed;
    };
    loading: boolean,
    error: RejectedDataType | null,
}

export interface IFeed {
    name: string,
    items: (
        IPlaylist | 
        IAlbum | 
        IArtist |
        IShow | 
        IEpisode
    )[],
}