import { apiInstance } from "shared/api/base";
import { IArtist } from "shared/types";

const ENDPOINT = "/v1/artists/"

export const fetchArtist = (artistId: string): Promise<IArtist> => {
    return apiInstance.get<IArtist>(ENDPOINT + artistId);
}