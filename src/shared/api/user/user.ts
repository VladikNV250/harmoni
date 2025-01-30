import { apiInstance } from "shared/api/base"; 
import { IUserSavedAlbums, IUserTopItems } from "./types";

const ENDPOINT = "/v1/me"

export const fetchUserTopArtists = (): Promise<IUserTopItems> => {
    return apiInstance.get(ENDPOINT + "/top/artists");
}

export const fetchUserTopTracks = (options: {
    readonly limit?: number,
    readonly offset?: number,
    readonly time_range?: string,
} = {}): Promise<IUserTopItems> => {
    return apiInstance.get(ENDPOINT + "/top/tracks", {
        params: {
            limit: options.limit ?? null,
            offset: options.offset ?? null,
            time_range: options.time_range ?? null,
        }
    });
}

export const fetchUserSavedAlbums = (): Promise<IUserSavedAlbums> => {
    return apiInstance.get(ENDPOINT + "/albums");
}

