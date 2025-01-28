import { IImage } from "shared/types";
import { IEpisode } from "../episode/types";
import { ITrack } from "../track/types";

export interface IPlaylist {
    /** true if the owner allows other users to modify the playlist. */
    readonly collaborative: boolean,
    /** The playlist description */
    readonly description: string | null,
    /** Known external URLs for this playlist */
    readonly external_urls: { 
        /** The Spotify URL for the object. */
        readonly spotify: string 
    },
    /** Information about the followers of the playlist. */
    readonly followers: {
        /** Web API does not support it at the moment */
        readonly href: null,
        /** The total number of followers. */
        readonly total: number,
    }
    /** A link to the Web API endpoint providing full details of the playlist. */
    readonly href: string,
    /** The Spotify ID for the playlist. */
    readonly id: string,
    /** Images for the playlist. */
    readonly images: IImage[],
    /** The name of the playlist. */
    readonly name: string;
    /** The user who owns the playlist */
    readonly owner: {
        /** Known public external URLs for this user. */
        readonly external_urls: { 
            /** The Spotify URL for the object. */
            readonly spotify: string 
        },
        /** Information about the followers of this user. */
        readonly followers: {
            /** Web API does not support it at the moment. */
            readonly href: null,
            /** The total number of followers. */
            readonly total: number,
        }
        /** A link to the Web API endpoint for this user. */
        readonly href: string,
        /** The Spotify user ID for this user. */
        readonly id: string,
        /** The object type. */
        readonly type: "user",
        /** The object type. */
        readonly uri: string,
        /** The name displayed on the user's profile. null if not available. */
        readonly display_name: string | null,
    }
    /** The playlist's public/private status */
    readonly public: boolean | null,
    /** The version identifier for the current playlist */
    readonly snapshot_id: string,
    /** The tracks of the playlist. */
    readonly tracks: {
        /** A link to the Web API endpoint returning the full result of the request */
        readonly href: string,
        /** The maximum number of items in the response */
        readonly limit: number,
        /** URL to the next page of items. */
        readonly next: string | null,
        /** The offset of the items returned */
        readonly offset: number,
        /** URL to the previous page of items. */
        readonly previous: number | null,
        /** The total number of items available to return. */
        readonly total: number,
        /** A list of the chapters */
        readonly items: IPlaylistTrack[],
    }
    /** The object type */
    readonly type: "playlist"
    /** The Spotify URI for the playlist */
    readonly uri: string,
}

export interface IPlaylistTrack {
    /** The date and time the track or episode was added */
    readonly added_at: string | null,
    /** The Spotify user who added the track or episode */
    readonly added_by: {
        /** Known public external URLs for this user. */
        readonly external_urls: { 
            /** The Spotify URL for the object. */
            readonly spotify: string 
        },
        /** Information about the followers of this user. */
        readonly followers: {
            /** Web API does not support it at the moment. */
            readonly href: null,
            /** The total number of followers. */
            readonly total: number,
        }
        /** A link to the Web API endpoint for this user */
        readonly href: string,
        /** The Spotify user ID for this user. */
        readonly id: string,
        /** The object type. */
        readonly type: 'user',
        /** The Spotify URI for this user */
        readonly uri: string,
    } | null,
    /** Whether this track or episode is a local file or not. */
    readonly is_local: boolean,
    /** Information about the track or episode */
    readonly track: ITrack | IEpisode
}