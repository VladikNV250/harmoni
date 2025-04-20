import { IAlbum } from "../album";
import { IArtist } from "../artist";
import { IEpisode } from "../episode";
import { ISimplifiedPlaylist } from "../playlist";
import { IShow } from "../show";
import { ITrack } from "../track";

export interface IUserTopItems {
    /** A link to the Web API endpoint returning the full result of the request */
    readonly href: string,
    /** The maximum number of items in the response */
    readonly limit: number,
    /** URL to the next page of items */
    readonly next: string | null,
    /** The offset of the items returned */
    readonly offset: number,
    /** URL to the previous page of items */
    readonly previous: string | null,
    /** The total number of items available to return */
    readonly total: number,
    /** Array of artists */
    readonly items: IArtist[] | ITrack[];
}

export interface ILibraryAlbums {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items to return. */
    readonly limit: number;
    /** URL to the next page of items */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
    /** The list of albums */
    readonly items: ISavedAlbum[];
}

export interface ISavedAlbum {
    /** The date and time the album was saved */
    readonly added_at: string;
    /** Information about the album. */
    readonly album: IAlbum;
}


export interface ILibraryPlaylists {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items to return. */
    readonly limit: number;
    /** URL to the next page of items */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
    /** The list of playlists */
    readonly items: ISimplifiedPlaylist[];
}


export interface ILibraryShows {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items to return. */
    readonly limit: number;
    /** URL to the next page of items */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
    /** The list of shows */
    readonly items: ISavedShow[];
}

export interface ISavedShow {
    /** The date and time the show was saved */
    readonly added_at: string;
    /** Information about the show. */
    readonly show: IShow;
}


export interface ILibraryArtists {
    readonly artists: {
        /** A link to the Web API endpoint */
        readonly href: string;
        /** The maximum number of items to return. */
        readonly limit: number;
        /** URL to the next page of items */
        readonly next: string | null;
        /** The cursors used to find the next set of items. */
        readonly cursors: {
            /** The cursor to use as key to find the next page of items. */
            readonly after: string | null;
            /** The cursor to use as key to find the previous page of items. */
            readonly before?: string;
        }
        /** The total number of items available to return. */
        readonly total: number;
        /** The list of artists */
        readonly items: IArtist[];
    } 
}

export interface ILikedTracks {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items to return. */
    readonly limit: number;
    /** URL to the next page of items */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
    /** The list of tracks */
    readonly items: ISavedTrack[];
}

export interface ISavedTrack {
    /** The date and time the track was saved */
    readonly added_at: string;
    /** Information about the track. */
    readonly track: ITrack | IEpisode;
}

export interface ILibraryEpisodes {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items to return. */
    readonly limit: number;
    /** URL to the next page of items */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
    /** The list of episodes */
    readonly items: ISavedEpisode[];
}

export interface ISavedEpisode {
    /** The date and time the episode was saved */
    readonly added_at: string;
    /** Information about the episode. */
    readonly episode: IEpisode;
}