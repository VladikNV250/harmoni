import { apiInstance } from "shared/api/base";
import { IArtist } from "shared/types";
import { IArtistAlbums, IArtistTopTracks, ISeveralArtists } from "./types";

const ENDPOINT = "/v1/artists"

export const fetchArtist = (artistId: string): Promise<IArtist> => {
    return apiInstance.get(ENDPOINT + "/" + artistId);
}

export const fetchSeveralArtists = (artistIds: string[]): Promise<ISeveralArtists> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            ids: artistIds.join(",")
        }
    });
}

export const fetchArtistTopTracks = (artistId: string): Promise<IArtistTopTracks> => {
    return apiInstance.get(ENDPOINT + `/${artistId}/top-tracks`)
}

export const fetchArtistAlbums = (
    artistId: string,
    params?: {
        readonly include_groups?: string,
        readonly market?: string,
        readonly limit?: number,
        readonly offset?: number,
    }
): Promise<IArtistAlbums> => {
    return apiInstance.get(ENDPOINT + `/${artistId}/albums`, {
        params: {
            include_groups: params?.include_groups || null,
            market: params?.market || null,
            limit: params?.limit ?? null,
            offset: params?.offset ?? null,
        }
    });
}