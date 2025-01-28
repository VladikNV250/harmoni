import { apiInstance } from "shared/api/base"; 
import { IUserSavedAlbums, IUserTopArtists } from "./types";

const ENDPOINT = "/v1/me"

export const fetchUserTopArtists = (): Promise<IUserTopArtists> => {
    return apiInstance.get(ENDPOINT + "/top/artists");
}

export const fetchUserSavedAlbums = (): Promise<IUserSavedAlbums> => {
    return apiInstance.get(ENDPOINT + "/albums");
}

