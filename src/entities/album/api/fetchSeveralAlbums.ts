import { apiInstance } from "shared/api/base";
import { IAlbum } from "shared/types";

const ENDPOINT = "/v1/albums";

export const fetchSeveralAlbum = (albumIds: string[]): Promise<{albums: IAlbum[]}> => {
    return apiInstance.get<{albums: IAlbum[]}>(ENDPOINT, {
        params: {
            ids: albumIds.join(",")
        }
    });
}