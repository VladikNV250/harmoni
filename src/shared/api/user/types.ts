import { IAlbum } from "../album";
import { IArtist } from "../artist";

export interface IUserTopArtists {
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
    readonly items: IArtist[];
}

export interface IUserSavedAlbums {
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
    readonly items: ISavedAlbum[];
}

export interface ISavedAlbum {
    readonly added_at: string;
    readonly album: IAlbum;
} 
