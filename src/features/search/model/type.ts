import { ISimplifiedAlbum } from "shared/api/album"
import { IArtist } from "shared/api/artist"
import { ICategory } from "shared/api/category"
import { ISimplifiedEpisode } from "shared/api/episode"
import { ISimplifiedPlaylist } from "shared/api/playlist"
import { ISimplifiedShow } from "shared/api/show"
import { ITrack } from "shared/api/track"
import { RejectedDataType } from "shared/types"

export interface ISearchState {
    search: {
        tracks: ITrack[],
        artists: IArtist[],
        albums: ISimplifiedAlbum[],
        playlists: ISimplifiedPlaylist[],
        shows: ISimplifiedShow[],
        episodes: ISimplifiedEpisode[],
    },
    categories: ICategory[],
    query: string,
    loading: boolean,
    error: RejectedDataType | null,
}

export type TSearchFilter = "All" | "Songs" | "Albums" | "Artists" | "Playlists" | "Podcasts";