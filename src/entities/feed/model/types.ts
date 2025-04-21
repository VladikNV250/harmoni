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
    /** Name of feed. */
    name: string,
    /** List of feed items. */
    items: (
        IPlaylist | 
        IAlbum | 
        IArtist |
        IShow | 
        IEpisode
    )[],
    /** Hidden object */
    hidden: {
        /** Whether feed is hidden. */
        isHidden: boolean,
        /** If true, user cannot change visibility of feed. */
        locked: boolean,
    },
    /** Sequence number in list of feeds.
     * - negative order means feed is pinned
     * - positive order means feed is unpinned
     */
    order: number,    
}

export type TFeedFilter = "All" | "Music" | "Podcasts"