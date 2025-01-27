import { IImage } from "./imageTypes";

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