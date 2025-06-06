import { ICopyright, IImage } from "shared/types"
import { ISimplifiedArtist } from "../artist"

export interface IEpisode {
    /** A description of the episode */
    readonly description: string,
    /** A description of the episode. This field may contain HTML tags. */
    readonly html_description: string,
    /** The episode length in milliseconds. */
    readonly duration_ms: number,
    /** Whether or not the episode has explicit content */
    readonly explicit: boolean,
    /** External URLs for this episode. */
    readonly external_urls: {
        /** The Spotify URL for the object. */
        readonly spotify: string,
    },
    /** The Spotify URL for the object. */
    readonly href: string,
    /** The Spotify ID for the episode. */
    readonly id: string,
    /** The cover art for the episode in various sizes, widest first. */
    readonly images: IImage[],
    /** True if the episode is hosted outside of Spotify's CDN. */
    readonly is_externally_hosted: boolean,
    /** True if the episode is playable in the given market. */
    readonly is_playable: boolean,
    /** A list of the languages used in the episode */
    readonly languages: string[],    
    /** The name of the episode. */
    readonly name: string,
    /** The date the episode was first released */
    readonly release_date: string,
    /** The precision with which release_date value is known */
    readonly release_date_precision: "year" | "month" | "day",
    /** The user's most recent position in the episode */
    readonly resume_point?: {
        /** Whether or not the episode has been fully played by the user */
        readonly fully_played: boolean,
        /** The user's most recent position in the episode in milliseconds. */
        readonly resume_position_ms: number,
    }
    /** The object type */
    readonly type: "episode",
    /** The Spotify URI for the episode. */
    readonly uri: string,
    /** Included in the response when a content restriction is applied. */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason: "market" | "product" | "explicit",
    }
    /** The show on which the episode belongs. */
    readonly show: {
        /** A list of the countries in which the show can be played */
        readonly available_markets: string[],
        /** The copyright statements of the show. */
        readonly copyrights: ICopyright[],
        /** A description of the show. */
        readonly description: string,
        /** A description of the show. This field may contain HTML tags. */
        readonly html_description: string,
        /** Whether or not the show has explicit content */
        readonly explicit: boolean,
        /** External URLs for this show. */
        readonly external_urls: {
            /** The Spotify URL for the object */
            readonly spotify: string,
        }
        /** A link to the Web API endpoint providing full details of the show. */
        readonly href: string,
        /** The Spotify ID for the show. */
        readonly id: string,
        /** The cover art for the show in various sizes, widest first */
        readonly images: IImage[],
        /** True if all of the shows episodes are hosted outside of Spotify's CDN */
        readonly is_externally_hosted: boolean,
        /** A list of the languages used in the show */
        readonly languages: string[],
        /** The media type of the show. */
        readonly media_type: string,
        /** The name of the episode. */
        readonly name: string,
        /** The publisher of the show. */
        readonly publisher: string,
        /** The object type */
        readonly type: "show",
        /** The Spotify URI for the show. */
        readonly uri: string,
        /** The total number of episodes in the show. */
        readonly total_episodes: number, 
    }
}

export interface ISimplifiedEpisode {
    /** A description of the episode */
    readonly description: string,
    /** A description of the episode. This field may contain HTML tags. */
    readonly html_description: string,
    /** The episode length in milliseconds. */
    readonly duration_ms: number,
    /** Whether or not the episode has explicit content */
    readonly explicit: boolean,
    /** External URLs for this episode. */
    readonly external_urls: {
        /** The Spotify URL for the object. */
        readonly spotify: string,
    },
    /** The Spotify URL for the object. */
    readonly href: string,
    /** The Spotify ID for the episode. */
    readonly id: string,
    /** The cover art for the episode in various sizes, widest first. */
    readonly images: IImage[],
    /** True if the episode is hosted outside of Spotify's CDN. */
    readonly is_externally_hosted: boolean,
    /** True if the episode is playable in the given market. */
    readonly is_playable: boolean,
    /** A list of the languages used in the episode */
    readonly languages: string[],    
    /** The name of the episode. */
    readonly name: string,
    /** The date the episode was first released */
    readonly release_date: string,
    /** The precision with which release_date value is known */
    readonly release_date_precision: "year" | "month" | "day",
    /** The user's most recent position in the episode */
    readonly resume_point?: {
        /** Whether or not the episode has been fully played by the user */
        readonly fully_played: boolean,
        /** The user's most recent position in the episode in milliseconds. */
        readonly resume_position_ms: number,
    }
    /** The object type */
    readonly type: "episode",
    /** The Spotify URI for the episode. */
    readonly uri: string,
    /** Included in the response when a content restriction is applied. */
    readonly restrictions?: {
        /** The reason for the restriction */
        readonly reason: "market" | "product" | "explicit",
    }
}

export interface IPlaylistEpisode {
    /** The album on which the track appears */
    readonly album: {
        /** The type of the album. */
        readonly album_type: "compilation",
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
        readonly type: "show",
        /** The Spotify URI for the album. */
        readonly uri: string,
        /** The artists of the album */
        readonly artists: ISimplifiedArtist[],
    },
    /** The artists who performed the track */
    readonly artists: ISimplifiedArtist[],
    /** A list of the countries in which the show can be played */
    readonly available_markets: string[],
    /** The disc number */
    readonly disc_number: number,
    /** The track length in milliseconds. */
    readonly duration_ms: number,
    /** */
    readonly episode: boolean,
    /** Whether or not the episode has explicit content */
    readonly explicit: boolean,
    /** External URLs for this episode. */
    readonly external_urls: {
        /** The Spotify URL for the object. */
        readonly spotify: string,
    },
    /** External IDs for this episode. */
    readonly external_ids: {
        /** The Spotify ID for the object. */
        readonly spotify: string,
    },
    /** The Spotify URL for the object. */
    readonly href: string,
    /** The Spotify ID for the episode. */
    readonly id: string,
    /** Whether or not the episode is from a local file. */
    readonly is_local: string,
    /** The name of the episode. */
    readonly name: string,
    /** The popularity of the episode */
    readonly popularity: number,
    /**  */
    readonly preview_url: string,
    /**  */
    readonly track: boolean,
    /** The number of the episode */
    readonly track_number: number,
    /** The object type */
    readonly type: "episode",
    /** The Spotify URI for the episode. */
    readonly uri: string,
}

export interface ISeveralEpisodes {
    readonly episodes: IEpisode[];
}