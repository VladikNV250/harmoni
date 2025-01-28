import { ICopyright, IImage } from "shared/types"
import { ISimplifiedEpisode } from "../episode/types"

export interface IShow {
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
        /** The Spotify URL for the object. */
        readonly spotify: string,
    }   
    /** A link to the Web API endpoint providing full details of the show. */
    readonly href: string,
    /** The Spotify ID for the show. */
    readonly id: string,
    /** The cover art for the show in various sizes, widest first. */
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
    /** The object type. */
    readonly type: "show",
    /** The Spotify URI for the show. */
    readonly uri: string,
    /** The total number of episodes in the show. */
    readonly total_episodes: number,
    /** The episodes of the show. */
    readonly episodes: {
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
        /** A list of the episodes */
        readonly items: ISimplifiedEpisode[],
    }
}

export interface ISeveralShows {
    readonly shows: IShow[];
}