import { ISimplifiedAlbum } from "../album";
import { IArtist } from "../artist";
import { ISimplifiedEpisode } from "../episode";
import { ISimplifiedPlaylist } from "../playlist";
import { ISimplifiedShow } from "../show";
import { ITrack } from "../track";

interface IItemsInfo {
    /** A link to the Web API endpoint */
    readonly href: string;
    /** The maximum number of items in the response  */
    readonly limit: number;
    /** URL to the next page of items. */
    readonly next: string | null;
    /** The offset of the items returned */
    readonly offset: number;
    /** URL to the previous page of items. */
    readonly previous: string | null;
    /** The total number of items available to return. */
    readonly total: number;
}

interface IItemsInfoTrack extends IItemsInfo {
    readonly items: ITrack[];
}
interface IItemsInfoArtist extends IItemsInfo {
    readonly items: IArtist[];
}
interface IItemsInfoAlbum extends IItemsInfo {
    readonly items: ISimplifiedAlbum[];
}
interface IItemsInfoPlaylist extends IItemsInfo {
    readonly items: ISimplifiedPlaylist[];
}
interface IItemsInfoShow extends IItemsInfo {
    readonly items: ISimplifiedShow[];
}
interface IItemsInfoEpisode extends IItemsInfo {
    readonly items: ISimplifiedEpisode[];
}

export interface ISearchParams {
    query: string,
    type: ("album" | "playlist" | "artist" | "track" | "show" | "episode")[],
    market?: string,
    limit?: number,
    offset?: number,
    include_external?: "audio",
}

export interface ISearchResult {
    readonly tracks?: IItemsInfoTrack;
    readonly artists?: IItemsInfoArtist;
    readonly albums?: IItemsInfoAlbum;
    readonly playlists?: IItemsInfoPlaylist;
    readonly shows?: IItemsInfoShow;
    readonly episodes?: IItemsInfoEpisode;
}