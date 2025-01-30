import { IAlbum } from "shared/api/album";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IPlaylist } from "shared/api/playlist";
import { IShow } from "shared/api/show";
import { ITrack } from "shared/api/track";
import { RejectedDataType } from "shared/types";

export interface IFeedState {
    feeds: {
        [key: string]: IFeed;
    };
    loading: boolean,
    error: RejectedDataType | null,
    userTracks: {
        items: ITrack[],
        showForUser: boolean,
    },
    settings: {
        updateAfterEveryReload: boolean,
    }
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
    hidden: {
        isHidden: boolean,
        locked: boolean,
    },
    order: number, // negative order means feed is pinned, positive is unpinned    
}

export type TFeedFilter = "all" | "music" | "podcasts"