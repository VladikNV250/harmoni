import { IAlbum, ICopyright, IImage } from "shared/types";
import { ISimplifiedArtist } from "../artist/types";
import { ISimplifiedTrack } from "../track/types";

export interface IAlbum {
    /** The type of the album */
    readonly album_type: "album" | "single" | "compilation",
    /** The number of tracks in the album */
    readonly total_traks: number,
    /** The markets in which the album is available */
    readonly available_markets: string[],
    /** Known external URLs for this album */
    readonly external_urls: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** A link to the Web API endpoint providing full details of the album. */
    readonly href: string,
    /** The Spotify ID for the album */
    readonly id: string,
    /** The cover art for the album in various sizes, widest first */
    readonly images: IImage[],
    /** The name of the album. In case of an album takedown, the value may be an empty string */
    readonly name: string,
    /** The date the album was first released */
    readonly release_date: string,
    /** The precision with which release_date value is known */
    readonly release_date_precision: "year" | "month" | "day";
    /** ncluded in the response when a content restriction is applied */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason: "market" | "product" | "explicit",
    },
    /** The object type */
    readonly type: "album",
    /** The Spotify URI for the album */
    readonly uri: string,
    /** The artists of the album */
    readonly artists: ISimplifiedArtist[],
    /** The tracks of the album */
    readonly tracks: {
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
        /** Detail of tracks */
        readonly items: ISimplifiedTrack[],
    },
    /** The copyright statements of the album. */
    readonly copyrights: ICopyright[],
    /** Known external IDs for the album. */
    readonly external_ids: {
        /** International Standard Recording Code */
        readonly isrc?: string,
        /** International Article Number */
        readonly ean?: string,
        /** Universal Product Code */
        readonly upc?: string,
    },
    /** The label associated with the album */
    readonly label: string,
    /** The popularity of the album. The value will be between 0 and 100, with 100 being the most popular. */
    readonly popularity: number,
}

export interface ISimplifiedAlbum {
    /** The type of the album */
    readonly album_type: "album" | "single" | "compilation",
    /** The number of tracks in the album */
    readonly total_traks: number,
    /** The markets in which the album is available */
    readonly available_markets: string[],
    /** Known external URLs for this album */
    readonly external_urls: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** A link to the Web API endpoint providing full details of the album. */
    readonly href: string,
    /** The Spotify ID for the album */
    readonly id: string,
    /** The cover art for the album in various sizes, widest first */
    readonly images: IImage[],
    /** The name of the album. In case of an album takedown, the value may be an empty string */
    readonly name: string,
    /** The date the album was first released */
    readonly release_date: string,
    /** The precision with which release_date value is known */
    readonly release_date_precision: "year" | "month" | "day";
    /** ncluded in the response when a content restriction is applied */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason: "market" | "product" | "explicit",
    },
    /** The object type */
    readonly type: "album",
    /** The Spotify URI for the album */
    readonly uri: string,
    /** The artists of the album */
    readonly artists: ISimplifiedArtist[],
}

export interface ISeveralAlbums {
    readonly albums: IAlbum[],
}

export interface INewReleases {
    readonly albums: {
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
        readonly items: ISimplifiedAlbum[];
    }
    
}