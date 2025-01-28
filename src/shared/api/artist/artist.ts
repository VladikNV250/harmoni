import { apiInstance } from "shared/api/base";
import { IArtist } from "shared/types";
import { ISeveralArtists } from "./types";

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

