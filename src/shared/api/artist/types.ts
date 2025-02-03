import { IImage } from "shared/types"
import { ITrack } from "../track";
import { ISimplifiedAlbum } from "../album";

export interface IArtist {
    /** Known external URLs for this artist */
    readonly external_urls: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** Information about the followers of the artist */
    readonly followers: { 
        /** Web API does not support this at the moment */
        readonly href: null,
        /** The total number of followers */
        readonly total: number,
    },
    /** A list of the genres the artist is associated with */
    readonly genres: string[],
    /** A link to the Web API endpoint providing full details of the artist */
    readonly href: string,
    /** The Spotify ID for the artist. */
    readonly id: string,
    /** Images of the artist in various sizes, widest first */
    readonly images: IImage[],
    /** The name of the artist */
    readonly name: string,
    /** The popularity of the artist */
    readonly popularity: number,
    /** The object type. */
    readonly type: "artist",
    /** The Spotify URI for the artist. */
    readonly uri: string,
}

export interface ISimplifiedArtist {
    /** Known external URLs for this artist */
    readonly external_urls?: {
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** A link to the Web API endpoint providing full details of the artist */
    readonly href?: string,
    /** The Spotify ID for the artist */
    readonly id?: string,
    /** The name of the artist */
    readonly name?: string,
    /** The object type */
    readonly type?: "artist",
    /** The Spotify URI for the artist */
    readonly uri?: string,
}

export interface ISeveralArtists {
    readonly artists: IArtist[];
}

export interface IArtistTopTracks {
    readonly tracks: ITrack[];
}

export interface IArtistAlbums {
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
    /** Array of albums */
    readonly items: ISimplifiedAlbum[];
}