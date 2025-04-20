import { apiInstance } from "shared/api/base";
import { IAlbum, INewReleases, ISeveralAlbums } from "./types";

const ENDPOINT = "/v1/albums";

export const fetchAlbum = (albumId: string): Promise<IAlbum> => {
    return apiInstance.get(ENDPOINT + "/" + albumId);
}


export const fetchSeveralAlbums = (albumIds: string[]): Promise<ISeveralAlbums> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            ids: albumIds.join(",")
        }
    });
}


const NEW_RELEASES_ENDPOINT = "/v1/browse/new-releases";
export const fetchNewReleases = (): Promise<INewReleases> => {
    return apiInstance.get(NEW_RELEASES_ENDPOINT);
}