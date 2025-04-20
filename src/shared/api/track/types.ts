import { IImage } from "shared/types";
import { ISimplifiedArtist } from "../artist/types";

export interface ITrack {
    /** The album on which the track appears */
    readonly album: {
        /** The type of the album. */
        readonly album_type: "album" | "single" | "compilation",
        /** The number of tracks in the album */
        readonly total_tracks: number,
        /** The markets in which the album is available */
        readonly available_marlets: string[],
        /** Known external URLs for this album. */
        readonly external_urls: { 
            /** The Spotify URL for the object. */
            readonly spotify: string 
        };
        /** A link to the Web API endpoint providing full details of the album */
        readonly href: string,
        /** The Spotify ID for the album. */
        readonly id: string,
        /** The cover art for the album in various sizes, widest first */
        readonly images: IImage[],
        /** The name of the album. */
        readonly name: string,
        /** The date the album was first released. */
        readonly release_date: string,
        /** The precision with which release_date value is known */
        readonly release_date_precision: "year" | "month" | "day",
        /** Included in the response when a content restriction is applied. */
        readonly restrictions?: {
            /** The reason for the restriction */
            readonly reason: "market" | "product" | "explicit",
        }
        /** The object type. */
        readonly type: "album",
        /** The Spotify URI for the album. */
        readonly uri: string,
        /** The artists of the album */
        readonly artists: ISimplifiedArtist[],
    },
    /** The artists who performed the track */
    readonly artists: ISimplifiedArtist[],
    /** A list of the countries in which the track can be played */
    readonly available_markets: string[],
    /** The disc number */
    readonly disc_number: number,
    /** The track length in milliseconds. */
    readonly duration_ms: number,
    /** Whether or not the track has explicit lyrics */
    readonly explicit: boolean,
    /** Known external IDs for the track. */
    readonly external_ids: {
        /** International Standard Recording Code */
        readonly isrc?: string,
        /** International Standard Recording Code */
        readonly ean?: string,
        /** Universal Product Code */
        readonly upc?: string,
    }
    /** Known external URLs for this track. */
    readonly external_urls: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** A link to the Web API endpoint providing full details of the track. */
    readonly href: string,
    /** The Spotify ID for the track. */
    readonly id: string,
    /** If true, the track is playable in the given market. */
    readonly is_playable: boolean,
    /** The track in the linked_from object contains information about the originally requested track. */
    readonly linked_from?: {
        /** Known external URLs for this track. */
        readonly external_urls?: { 
            /** The Spotify URL for the object. */
            readonly spotify: string 
        },
        /** A link to the Web API endpoint providing full details of the track */
        readonly href?: string,
        /** The Spotify ID for the track. */
        readonly id?: string,
        /** The object type: "track". */
        readonly type?: "track",
        /** The Spotify URI for the track. */
        readonly uri?: string,
    }
    /** Included in the response when a content restriction is applied */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason: "market" | "product" | "explicit",
    }
    /** The name of the track. */
    readonly name: string,
    /** The popularity of the track */
    readonly popularity: number,
    /** The number of the track */
    readonly track_number: number,
    /** The object type */
    readonly type: "track",
    /** The Spotify URI for the track. */
    readonly uri: string,
    /** Whether or not the track is from a local file. */
    readonly is_local: string,
}

export interface ISimplifiedTrack {
    /** The artists who performed the track */
    readonly artists?: ISimplifiedArtist[],
    /** A list of the countries in which the track can be played */
    readonly available_markets?: string[],
    /** The disc number */
    readonly disc_number?: number,
    /** The track length in milliseconds */
    readonly duration_ms?: number,
    /** Whether or not the track has explicit lyrics */
    readonly explicit?: boolean,
    /** External URLs for this track */
    readonly external_urls?: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** A link to the Web API endpoint providing full details of the track */
    readonly href?: string,
    /** The Spotify ID for the track */
    readonly id?: string,
    /** If true, the track is playable in the given market. */
    readonly is_playable?: boolean,
    /**  The track in the linked_from object contains information about the originally requested track. */
    readonly linked_from?: {
        /** Known external URLs for this track. */
        readonly external_urls?: { 
            /** The Spotify URL for the object. */
            readonly spotify: string 
        },
        /** A link to the Web API endpoint providing full details of the track */
        readonly href?: string,
        /** The Spotify ID for the track. */
        readonly id?: string,
        /** The object type: "track". */
        readonly type?: "track",
        /** The Spotify URI for the track. */
        readonly uri?: string,
    },
    /** Included in the response when a content restriction is applied. */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason?: "market" | "product" | "explicit",
    },
    /** The name of the track */
    readonly name?: string,
    /** The number of the track. */
    readonly track_number?: number,
    /** The object type: "track" */
    readonly type?: "track",
    /** The Spotify URI for the track. */
    readonly uri?: string,
    /** Whether or not the track is from a local file. */
    readonly is_local?: boolean,
}